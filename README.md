# BookIt: Experiences & Slots Booking Platform

A full-stack web application for booking travel experiences with real-time slot availability, promo code validation, and secure checkout.

## 🚀 Live Demo

- **Frontend**: [Your Vercel URL]
- **Backend API**: [Your Render/Railway URL]
- **GitHub**: [Your Repository URL]

## 📋 Features

- ✅ Browse travel experiences with ratings and reviews
- ✅ View detailed experience information
- ✅ Select dates and available time slots
- ✅ Real-time slot availability updates
- ✅ Apply promo codes (SAVE10, FLAT100)
- ✅ Secure booking with form validation
- ✅ Booking confirmation with unique ID
- ✅ Prevent double-booking for same slots
- ✅ Responsive design (mobile & desktop)
- ✅ Loading states and error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Axios** for API calls
- **Lucide React** for icons
- **React Router** (optional for routing)

### Backend
- **Node.js** with Express
- **TypeScript**
- **PostgreSQL** database
- **pg** (node-postgres) for database connection
- **CORS** for cross-origin requests

## 📁 Project Structure

```
bookit-fullstack/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExperienceCard.tsx
│   │   │   ├── SlotSelector.tsx
│   │   │   └── BookingSummary.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── DetailsPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── ResultPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── database.ts
│   │   └── types.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/bookit
   NODE_ENV=development
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb bookit
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 📦 Installation Commands

### Backend Dependencies
```bash
npm install express cors pg dotenv
npm install -D @types/express @types/cors @types/node typescript ts-node nodemon
```

### Frontend Dependencies
```bash
npm create vite@latest frontend -- --template react-ts
npm install axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 🌐 API Endpoints

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get experience details
- `GET /api/experiences/:id/slots?date=YYYY-MM-DD` - Get available slots

### Bookings
- `POST /api/bookings` - Create a new booking
  ```json
  {
    "experience_id": 1,
    "slot_id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "guests": 2,
    "total_price": 298,
    "promo_code": "SAVE10"
  }
  ```
- `GET /api/bookings/:id` - Get booking details

### Promo Codes
- `POST /api/promo/validate` - Validate promo code
  ```json
  {
    "code": "SAVE10"
  }
  ```

## 🎨 Design System

### Colors
- Primary: Indigo (600, 700)
- Success: Green (500, 600)
- Error: Red (500, 600)
- Background: Blue-50 to Indigo-50 gradient

### Typography
- Headings: Bold, 2xl-4xl
- Body: Regular, base-lg
- Labels: Semibold, sm-base

### Components
- Rounded corners: 2xl for cards, lg for inputs
- Shadows: lg for cards, xl for modals
- Spacing: Consistent 4, 6, 8, 12 scale

## 🔒 Security Features

- Input validation on both frontend and backend
- SQL injection prevention using parameterized queries
- Transaction-based booking to prevent race conditions
- Email format validation
- Phone number sanitization

## 🧪 Testing

### Backend Testing
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test experiences endpoint
curl http://localhost:5000/api/experiences

# Test booking creation
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "experience_id": 1,
    "slot_id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "guests": 2,
    "total_price": 298
  }'
```

## 📤 Deployment

### Backend Deployment (Render/Railway)

1. **Create a new PostgreSQL database** on your hosting platform
2. **Set environment variables**:
   - `DATABASE_URL`
   - `NODE_ENV=production`
3. **Deploy from GitHub** or use CLI
4. **Database will auto-initialize** on first startup

### Frontend Deployment (Vercel)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Set environment variable**:
   - `VITE_API_URL=https://your-backend-url.com/api`

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## 🎯 Key Features Implementation

### 1. Slot Availability
- Real-time updates from database
- Disabled UI for sold-out slots
- Transaction locks prevent double-booking

### 2. Promo Codes
- **SAVE10**: 10% discount
- **FLAT100**: $100 flat discount
- Validation before checkout

### 3. Form Validation
- Required fields: name, email, phone
- Email format validation
- Guest count (1-10)

### 4. Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly buttons and inputs

## 🐛 Common Issues

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string
psql $DATABASE_URL
```

### CORS Error
- Ensure backend has `cors()` middleware
- Check API URL in frontend `.env`

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

## 📝 Sample Data

The application auto-populates with 4 sample experiences:
- Sunset Desert Safari (Dubai)
- Northern Lights Tour (Iceland)
- Bali Temple & Rice Terraces (Indonesia)
- Swiss Alps Hiking (Switzerland)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👥 Author

Your Name - [GitHub](https://github.com/Tushar-2702)

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Design inspiration from modern booking platforms

---

**Built with ❤️ for the Fullstack Intern Assignment**
