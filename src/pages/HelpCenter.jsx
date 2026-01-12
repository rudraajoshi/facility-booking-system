import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';

function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const helpCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: '🚀',
      articles: [
        { title: 'How to create an account', link: '#create-account' },
        { title: 'Navigating the dashboard', link: '#dashboard' },
        { title: 'Understanding facility types', link: '#facility-types' },
        { title: 'First-time booking guide', link: '#first-booking' },
      ]
    },
    {
      id: 'booking',
      name: 'Booking & Reservations',
      icon: '📅',
      articles: [
        { title: 'How to book a facility', link: '#how-to-book' },
        { title: 'Modifying your booking', link: '#modify-booking' },
        { title: 'Canceling a reservation', link: '#cancel-booking' },
        { title: 'Understanding booking status', link: '#booking-status' },
        { title: 'Recurring bookings', link: '#recurring' },
      ]
    },
    {
      id: 'payments',
      name: 'Payments & Billing',
      icon: '💳',
      articles: [
        { title: 'Payment methods accepted', link: '#payment-methods' },
        { title: 'Understanding pricing', link: '#pricing' },
        { title: 'Refund policy', link: '#refunds' },
        { title: 'Invoice and receipts', link: '#invoices' },
      ]
    },
    {
      id: 'facilities',
      name: 'Facilities',
      icon: '🏢',
      articles: [
        { title: 'Browsing available facilities', link: '#browse' },
        { title: 'Facility amenities guide', link: '#amenities' },
        { title: 'Checking availability', link: '#availability' },
        { title: 'Facility capacity information', link: '#capacity' },
      ]
    },
    {
      id: 'account',
      name: 'Account Management',
      icon: '👤',
      articles: [
        { title: 'Updating profile information', link: '#update-profile' },
        { title: 'Changing password', link: '#change-password' },
        { title: 'Email preferences', link: '#email-prefs' },
        { title: 'Deleting your account', link: '#delete-account' },
      ]
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: '🔧',
      articles: [
        { title: 'Login issues', link: '#login-issues' },
        { title: 'Booking errors', link: '#booking-errors' },
        { title: 'Payment failures', link: '#payment-failures' },
        { title: 'Browser compatibility', link: '#browser' },
      ]
    }
  ];

  const filteredCategories = activeCategory === 'all' 
    ? helpCategories 
    : helpCategories.filter(cat => cat.id === activeCategory);

  const searchResults = searchQuery.trim() 
    ? helpCategories.flatMap(cat => 
        cat.articles
          .filter(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(article => ({ ...article, category: cat.name }))
      )
    : [];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            How can we help you?
          </h1>
          <p className="text-xl text-primary-100 mb-8 text-center max-w-2xl mx-auto">
            Search our knowledge base or browse categories below
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for help articles..."
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
        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Search Results ({searchResults.length})
            </h2>
            {searchResults.length > 0 ? (
              <Card>
                <Card.Body>
                  <div className="divide-y divide-neutral-200">
                    {searchResults.map((result, index) => (
                      <a
                        key={index}
                        href={result.link}
                        className="block py-4 hover:bg-neutral-50 px-4 -mx-4 transition-colors"
                      >
                        <h3 className="font-semibold text-neutral-800 mb-1">
                          {result.title}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {result.category}
                        </p>
                      </a>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Card>
                <Card.Body>
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                      No results found
                    </h3>
                    <p className="text-neutral-600">
                      Try different keywords or browse categories below
                    </p>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <Card.Body>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                  📚
                </div>
                <div>
                  <div className="text-3xl font-bold text-neutral-800">120+</div>
                  <div className="text-sm text-neutral-600">Help Articles</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div>
                  <div className="text-3xl font-bold text-neutral-800">{'<5min'}</div>
                  <div className="text-sm text-neutral-600">Avg Response Time</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center text-2xl">
                  💬
                </div>
                <div>
                  <div className="text-3xl font-bold text-neutral-800">24/7</div>
                  <div className="text-sm text-neutral-600">Support Available</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Help Categories */}
        {!searchQuery.trim() && (
          <>
            <h2 className="text-3xl font-bold text-neutral-800 mb-6">
              Browse by Category
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {helpCategories.map((category) => (
                <Card key={category.id} hover>
                  <Card.Body>
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                      {category.name}
                    </h3>
                    <ul className="space-y-2">
                      {category.articles.slice(0, 4).map((article, index) => (
                        <li key={index}>
                          <a
                            href={article.link}
                            className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                          >
                            → {article.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                    {category.articles.length > 4 && (
                      <button className="text-sm text-primary-600 font-medium mt-3 hover:underline">
                        View all {category.articles.length} articles
                      </button>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hover>
              <Card.Body>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🔥</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      How to book a facility in 3 easy steps
                    </h3>
                    <p className="text-sm text-neutral-600 mb-3">
                      Learn the quickest way to reserve your perfect space
                    </p>
                    <a href="#" className="text-sm text-primary-600 font-medium hover:underline">
                      Read article →
                    </a>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card hover>
              <Card.Body>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💡</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      Understanding cancellation policies
                    </h3>
                    <p className="text-sm text-neutral-600 mb-3">
                      Everything you need to know about canceling bookings
                    </p>
                    <a href="#" className="text-sm text-primary-600 font-medium hover:underline">
                      Read article →
                    </a>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Still Need Help */}
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <Card.Body>
            <div className="text-center py-8">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                Still need help?
              </h2>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/contact-us">
                  <button className="btn btn-primary">
                    Contact Support
                  </button>
                </Link>
                <Link to="/faqs">
                  <button className="btn btn-outline">
                    View FAQs
                  </button>
                </Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default HelpCenter;