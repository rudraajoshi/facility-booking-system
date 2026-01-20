import { useState } from 'react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';

function FAQs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqCategories = [
    { id: 'all', name: 'All Questions', icon: '📚' },
    { id: 'booking', name: 'Booking', icon: '📅' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'facilities', name: 'Facilities', icon: '🏢' },
    { id: 'cancellation', name: 'Cancellation', icon: '❌' },
  ];

  const faqs = [
    {
      category: 'booking',
      question: 'How do I book a facility?',
      answer: 'To book a facility, first log in to your account. Then browse available facilities, select your desired date and time, review the pricing, and confirm your booking. You\'ll receive a confirmation email with all the details.'
    },
    {
      category: 'booking',
      question: 'Can I book multiple facilities at once?',
      answer: 'Yes! You can book multiple facilities by adding them to your cart. Navigate to each facility, select your preferred time slots, and add them to your cart. Then proceed to checkout to complete all bookings at once.'
    },
    {
      category: 'booking',
      question: 'How far in advance can I book?',
      answer: 'You can book facilities up to 90 days in advance. For special events or longer-term bookings, please contact our support team who can assist with extended reservations.'
    },
    {
      category: 'booking',
      question: 'What happens if my booking is declined?',
      answer: 'If a booking is declined, you\'ll receive an immediate notification via email and in your account. You will not be charged, and you can select an alternative time slot or facility.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and PayPal. All payments are processed securely through our encrypted payment gateway.'
    },
    {
      category: 'payment',
      question: 'When will I be charged?',
      answer: 'Your card will be charged immediately upon booking confirmation. For longer bookings, we may require a deposit upfront with the remaining balance due before the booking date.'
    },
    {
      category: 'payment',
      question: 'Can I get an invoice or receipt?',
      answer: 'Yes! You\'ll automatically receive a receipt via email after each booking. You can also download invoices from your account dashboard under "My Bookings" section.'
    },
    {
      category: 'payment',
      question: 'Are there any additional fees?',
      answer: 'The price displayed includes all standard fees. Additional charges may apply for extra services, equipment rentals, or overtime. These will be clearly indicated before you confirm your booking.'
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click on "Sign Up" in the top right corner, fill in your details (name, email, password), and verify your email address. Once verified, you can start booking facilities immediately.'
    },
    {
      category: 'account',
      question: 'I forgot my password. What should I do?',
      answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a reset link. Follow the instructions in the email to create a new password.'
    },
    {
      category: 'account',
      question: 'Can I change my email address?',
      answer: 'Yes, you can update your email address in your account settings. Go to Profile > Settings > Email. You\'ll need to verify the new email address before the change takes effect.'
    },
    {
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to Settings > Account > Delete Account. Please note that this action is permanent and will cancel all upcoming bookings. We recommend canceling bookings first to avoid cancellation fees.'
    },
    {
      category: 'facilities',
      question: 'How do I know if a facility is available?',
      answer: 'Each facility page shows real-time availability. Green dates indicate available slots, yellow shows limited availability, and red means fully booked. You can also use our availability calendar for a monthly view.'
    },
    {
      category: 'facilities',
      question: 'What amenities are included?',
      answer: 'Amenities vary by facility. Each facility page lists all included amenities such as WiFi, projector, whiteboard, etc. Premium amenities may be available for an additional fee.'
    },
    {
      category: 'facilities',
      question: 'Can I visit a facility before booking?',
      answer: 'Yes! We encourage facility tours. Contact us to schedule a visit during business hours. Some facilities offer virtual tours which you can access from the facility detail page.'
    },
    {
      category: 'facilities',
      question: 'What is the maximum capacity?',
      answer: 'Each facility has a specified maximum capacity listed on its detail page. This includes both seated and standing capacity. Exceeding the capacity limit is not permitted for safety reasons.'
    },
    {
      category: 'cancellation',
      question: 'What is your cancellation policy?',
      answer: 'You can cancel bookings up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours will incur a 50% fee. No-shows are not eligible for refunds.'
    },
    {
      category: 'cancellation',
      question: 'How do I cancel my booking?',
      answer: 'Go to "My Bookings" in your account dashboard, find the booking you want to cancel, and click "Cancel Booking". Confirm your cancellation and you\'ll receive a confirmation email.'
    },
    {
      category: 'cancellation',
      question: 'Can I modify my booking instead of canceling?',
      answer: 'Yes! You can modify your booking date, time, or duration subject to availability. Go to your booking details and click "Modify Booking". Note that price differences may apply.'
    },
    {
      category: 'cancellation',
      question: 'What happens in case of emergency closures?',
      answer: 'In case of emergency closures (weather, maintenance, etc.), we\'ll notify you immediately and provide a full refund or the option to reschedule at no additional cost.'
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-100 mb-8 text-center max-w-2xl mx-auto">
            Find answers to common questions about our facility booking system
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg rounded-lg"
              />
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-neutral-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${activeCategory === category.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                  }
                `}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-neutral-600">
          Showing <span className="font-semibold text-neutral-800">{filteredFAQs.length}</span> {filteredFAQs.length === 1 ? 'question' : 'questions'}
        </div>

        {/* FAQs List */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <Card key={index} hover>
                <div
                  className="cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <Card.Body>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">
                            {faqCategories.find(cat => cat.id === faq.category)?.icon}
                          </span>
                          <h3 className="text-lg font-semibold text-neutral-800">
                            {faq.question}
                          </h3>
                        </div>
                        
                        {openFAQ === index && (
                          <div className="mt-4 pl-11">
                            <p className="text-neutral-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <button
                        className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          transition-all duration-200
                          ${openFAQ === index
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }
                        `}
                      >
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            openFAQ === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </Card.Body>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Card.Body>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  No results found
                </h3>
                <p className="text-neutral-600 mb-6">
                  Try different keywords or browse all categories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Still Need Help Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <Card.Body>
              <div className="text-center py-8">
                <div className="text-5xl mb-4">💬</div>
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                  Still have questions?
                </h2>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Can't find what you're looking for? Our support team is ready to help!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="/contact-us">
                    <button className="btn btn-primary">
                      Contact Support
                    </button>
                  </a>
                  <a href="/help-center">
                    <button className="btn btn-outline">
                      Visit Help Center
                    </button>
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FAQs;