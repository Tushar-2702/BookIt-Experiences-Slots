import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Check, X, ChevronLeft, Star, Loader2 } from 'lucide-react';

// Mock API calls (replace with real backend)
const mockAPI = {
  experiences: [
    {
      id: 1,
      title: "Sunset Desert Safari",
      location: "Dubai, UAE",
      price: 149,
      rating: 4.8,
      reviews: 324,
      image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800",
      description: "Experience the thrill of dune bashing and traditional Bedouin camp",
      duration: "6 hours",
      groupSize: "Up to 15 people"
    },
    {
      id: 2,
      title: "Northern Lights Tour",
      location: "Reykjavik, Iceland",
      price: 299,
      rating: 4.9,
      reviews: 512,
      image: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800",
      description: "Chase the magical Aurora Borealis in the Icelandic wilderness",
      duration: "8 hours",
      groupSize: "Up to 12 people"
    },
    {
      id: 3,
      title: "Bali Temple & Rice Terraces",
      location: "Ubud, Bali",
      price: 89,
      rating: 4.7,
      reviews: 287,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      description: "Discover ancient temples and stunning rice paddies",
      duration: "5 hours",
      groupSize: "Up to 20 people"
    },
    {
      id: 4,
      title: "Swiss Alps Hiking",
      location: "Interlaken, Switzerland",
      price: 199,
      rating: 4.9,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
      description: "Hike through pristine Alpine landscapes with expert guides",
      duration: "7 hours",
      groupSize: "Up to 10 people"
    }
  ],
  
  getSlots: (experienceId, date) => {
    const slots = [
      { id: 1, time: "09:00 AM", available: 8, total: 15 },
      { id: 2, time: "12:00 PM", available: 3, total: 15 },
      { id: 3, time: "03:00 PM", available: 0, total: 15 },
      { id: 4, time: "06:00 PM", available: 12, total: 15 }
    ];
    return slots;
  },
  
  validatePromo: (code) => {
    const promos = {
      'SAVE10': { discount: 10, type: 'percentage' },
      'FLAT100': { discount: 100, type: 'fixed' }
    };
    return promos[code.toUpperCase()] || null;
  }
};

const App = () => {
  const [page, setPage] = useState('home');
  const [experiences, setExperiences] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    setExperiences(mockAPI.experiences);
  }, []);

  useEffect(() => {
    if (selectedExperience && selectedDate) {
      setSlots(mockAPI.getSlots(selectedExperience.id, selectedDate));
    }
  }, [selectedExperience, selectedDate]);

  const handleExperienceClick = (exp) => {
    setSelectedExperience(exp);
    setPage('details');
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    if (slot.available > 0) {
      setSelectedSlot(slot);
    }
  };

  const proceedToCheckout = () => {
    if (selectedSlot) {
      setPage('checkout');
    }
  };

  const applyPromoCode = () => {
    const promo = mockAPI.validatePromo(promoCode);
    setAppliedPromo(promo);
  };

  const calculateTotal = () => {
    let total = selectedExperience.price * bookingData.guests;
    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        total -= (total * appliedPromo.discount) / 100;
      } else {
        total -= appliedPromo.discount;
      }
    }
    return Math.max(0, total);
  };

  const handleBooking = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      setBookingResult({
        success,
        bookingId: success ? `BK${Date.now()}` : null,
        message: success ? 'Booking confirmed!' : 'Booking failed. Please try again.'
      });
      setLoading(false);
      setPage('result');
    }, 2000);
  };

  const resetBooking = () => {
    setPage('home');
    setSelectedExperience(null);
    setSelectedDate('');
    setSelectedSlot(null);
    setBookingData({ name: '', email: '', phone: '', guests: 1 });
    setPromoCode('');
    setAppliedPromo(null);
    setBookingResult(null);
  };

  // Home Page
  if (page === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-indigo-600">BookIt</h1>
          </div>
        </nav>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Experiences</h2>
            <p className="text-xl text-gray-600">Book unforgettable adventures around the world</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {experiences.map(exp => (
              <div 
                key={exp.id}
                onClick={() => handleExperienceClick(exp)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-64">
                  <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full font-bold text-indigo-600">
                    ${exp.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{exp.rating}</span>
                      <span className="ml-1 text-gray-500">({exp.reviews})</span>
                    </div>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Details Page
  if (page === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <button onClick={() => setPage('home')} className="mr-4">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-indigo-600">BookIt</h1>
          </div>
        </nav>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <img src={selectedExperience.image} alt={selectedExperience.title} className="w-full h-96 object-cover" />
            
            <div className="p-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{selectedExperience.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                  <span>{selectedExperience.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                  <span>{selectedExperience.duration}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-2 text-indigo-600" />
                  <span>{selectedExperience.groupSize}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg mb-8">{selectedExperience.description}</p>
              
              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold mb-4">Select Date & Time</h3>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Choose Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Available Slots</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {slots.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={slot.available === 0}
                          className={`p-4 rounded-lg border-2 transition ${
                            slot.available === 0
                              ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                              : selectedSlot?.id === slot.id
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-300 hover:border-indigo-400'
                          }`}
                        >
                          <div className="font-semibold text-lg">{slot.time}</div>
                          <div className={`text-sm ${slot.available === 0 ? 'text-gray-400' : 'text-gray-600'}`}>
                            {slot.available === 0 ? 'Sold Out' : `${slot.available} spots left`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedSlot && (
                  <button
                    onClick={proceedToCheckout}
                    className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Proceed to Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Checkout Page
  if (page === 'checkout') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <button onClick={() => setPage('details')} className="mr-4">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-indigo-600">BookIt</h1>
          </div>
        </nav>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Your Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Number of Guests</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                <h3 className="text-2xl font-bold mb-6">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold">{selectedExperience.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold">{selectedSlot.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests</span>
                    <span className="font-semibold">{bookingData.guests}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Price per person</span>
                    <span>${selectedExperience.price}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${selectedExperience.price * bookingData.guests}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600 mb-2">
                      <span>Discount</span>
                      <span>-${(selectedExperience.price * bookingData.guests) - calculateTotal()}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter code"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 text-green-600 text-sm flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      Promo code applied!
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">${calculateTotal()}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleBooking}
                  disabled={loading || !bookingData.name || !bookingData.email}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Page
  if (page === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          {bookingResult.success ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">Your booking has been successfully confirmed.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Booking ID</p>
                <p className="text-xl font-bold text-indigo-600">{bookingResult.bookingId}</p>
              </div>
              <p className="text-sm text-gray-600 mb-8">A confirmation email has been sent to {bookingData.email}</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Failed</h2>
              <p className="text-gray-600 mb-8">{bookingResult.message}</p>
            </>
          )}
          
          <button
            onClick={resetBooking}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default App;