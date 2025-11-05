// backend/src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database initialization
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS experiences (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      rating DECIMAL(2, 1),
      reviews INTEGER,
      image TEXT,
      description TEXT,
      duration VARCHAR(100),
      group_size VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS slots (
      id SERIAL PRIMARY KEY,
      experience_id INTEGER REFERENCES experiences(id),
      date DATE NOT NULL,
      time VARCHAR(20) NOT NULL,
      available INTEGER NOT NULL,
      total INTEGER NOT NULL,
      UNIQUE(experience_id, date, time)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      experience_id INTEGER REFERENCES experiences(id),
      slot_id INTEGER REFERENCES slots(id),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      guests INTEGER NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      promo_code VARCHAR(50),
      booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'confirmed'
    );
  `);

  // Insert sample data
  const experienceCount = await pool.query('SELECT COUNT(*) FROM experiences');
  if (experienceCount.rows[0].count === '0') {
    await pool.query(`
      INSERT INTO experiences (title, location, price, rating, reviews, image, description, duration, group_size)
      VALUES 
        ('Sunset Desert Safari', 'Dubai, UAE', 149, 4.8, 324, 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800', 
         'Experience the thrill of dune bashing and traditional Bedouin camp', '6 hours', 'Up to 15 people'),
        ('Northern Lights Tour', 'Reykjavik, Iceland', 299, 4.9, 512, 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800',
         'Chase the magical Aurora Borealis in the Icelandic wilderness', '8 hours', 'Up to 12 people'),
        ('Bali Temple & Rice Terraces', 'Ubud, Bali', 89, 4.7, 287, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
         'Discover ancient temples and stunning rice paddies', '5 hours', 'Up to 20 people'),
        ('Swiss Alps Hiking', 'Interlaken, Switzerland', 199, 4.9, 445, 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
         'Hike through pristine Alpine landscapes with expert guides', '7 hours', 'Up to 10 people');
    `);

    // Insert sample slots
    const dates = ['2025-11-10', '2025-11-11', '2025-11-12'];
    const times = ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'];
    
    for (let expId = 1; expId <= 4; expId++) {
      for (const date of dates) {
        for (const time of times) {
          const available = Math.floor(Math.random() * 15);
          await pool.query(
            'INSERT INTO slots (experience_id, date, time, available, total) VALUES ($1, $2, $3, $4, 15)',
            [expId, date, time, available]
          );
        }
      }
    }
  }
};

initDB().catch(console.error);

// Routes

// GET /experiences - List all experiences
app.get('/api/experiences', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM experiences ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// GET /experiences/:id - Get experience details
app.get('/api/experiences/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const experience = await pool.query('SELECT * FROM experiences WHERE id = $1', [id]);
    
    if (experience.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(experience.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// GET /experiences/:id/slots - Get available slots for an experience
app.get('/api/experiences/:id/slots', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    let query = 'SELECT * FROM slots WHERE experience_id = $1';
    const params: any[] = [id];

    if (date) {
      query += ' AND date = $2';
      params.push(date);
    }

    query += ' ORDER BY date, time';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// POST /bookings - Create a new booking
app.post('/api/bookings', async (req: Request, res: Response) => {
  const client = await pool.connect();
  
  try {
    const { experience_id, slot_id, name, email, phone, guests, total_price, promo_code } = req.body;

    // Validation
    if (!experience_id || !slot_id || !name || !email || !guests || !total_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await client.query('BEGIN');

    // Check slot availability
    const slot = await client.query('SELECT * FROM slots WHERE id = $1 FOR UPDATE', [slot_id]);
    
    if (slot.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Slot not found' });
    }

    if (slot.rows[0].available < guests) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough slots available' });
    }

    // Create booking
    const booking = await client.query(
      `INSERT INTO bookings (experience_id, slot_id, name, email, phone, guests, total_price, promo_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [experience_id, slot_id, name, email, phone, guests, total_price, promo_code]
    );

    // Update slot availability
    await client.query(
      'UPDATE slots SET available = available - $1 WHERE id = $2',
      [guests, slot_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      booking: booking.rows[0],
      message: 'Booking created successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    client.release();
  }
});

// POST /promo/validate - Validate promo code
app.post('/api/promo/validate', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const promoCodes: { [key: string]: any } = {
      'SAVE10': { discount: 10, type: 'percentage', valid: true },
      'FLAT100': { discount: 100, type: 'fixed', valid: true }
    };

    const promo = promoCodes[code.toUpperCase()];

    if (promo) {
      res.json(promo);
    } else {
      res.status(404).json({ valid: false, message: 'Invalid promo code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate promo code' });
  }
});

// GET /bookings/:id - Get booking details
app.get('/api/bookings/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await pool.query(`
      SELECT b.*, e.title, e.location, s.date, s.time
      FROM bookings b
      JOIN experiences e ON b.experience_id = e.id
      JOIN slots s ON b.slot_id = s.id
      WHERE b.id = $1
    `, [id]);

    if (booking.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});