import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FacilityCard from '../components/facilities/FacilityCard';
import Loading from '../components/common/Loading';
import { useAuth } from '../hooks/useAuth';
import { useFacilities } from '../hooks/useFacilities';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { facilities, loading, error } = useFacilities();
  const featuredFacilities = facilities.slice(0, 6);
  const handleBook = (facilityId) => {
    navigate(`/booking/${facilityId}`);
  };
  const handleViewDetails = (facilityId) => {
    navigate(`/facilities/${facilityId}`);
  };

  const benefits = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Booking",
      description: "Book your desired facility in seconds with our streamlined booking process. No waiting, no hassle.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "24/7 Availability",
      description: "Access our booking system anytime, anywhere. Make reservations at your convenience, day or night.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Secure & Reliable",
      description: "Your bookings are safe with us. We ensure your data is protected and your reservations are confirmed.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Best Prices",
      description: "Competitive pricing with transparent costs. No hidden fees, just straightforward pricing for quality facilities.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Premium Facilities",
      description: "Access to modern, well-equipped spaces perfect for meetings, conferences, training sessions, and more.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "Easy Management",
      description: "Track all your bookings in one place. View, modify, or cancel reservations with just a few clicks.",
      color: "from-teal-500 to-teal-600"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Clients", icon: "😊" },
    { number: "1000+", label: "Bookings Completed", icon: "✅" },
    { number: "50+", label: "Premium Facilities", icon: "🏢" },
    { number: "24/7", label: "Support Available", icon: "💬" }
  ];

  return (
    <>
      {/* hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-primary-800 dark:via-primary-900 dark:to-neutral-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent-300 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-fade-in">
            Book Your Facility in Seconds
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 dark:text-primary-200 mb-8 max-w-3xl mx-auto animate-fade-in-up">
            Reserve conference rooms, meeting spaces, and more with ease
          </p>
          
          {isAuthenticated() ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                <p className="text-primary-100 dark:text-primary-200 text-sm">Welcome back,</p>
                <p className="text-white font-semibold text-lg">{currentUser?.name}! 👋</p>
              </div>
              <Link to="/facilities">
                <Button 
                  variant="white" 
                  size="lg" 
                  className="inline-block font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Facilities
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              <Link to="/facilities">
                <Button 
                  variant="white" 
                  size="lg" 
                  className="inline-block font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Facilities
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="inline-block font-semibold border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all"
                >
                  Sign Up Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* featured facilities*/}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Featured Facilities
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Browse our top-rated facilities available for booking
            </p>
          </div>

          {loading ? (
            <div className="py-12">
              <Loading size="lg" text="Loading facilities..." />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-error-600 dark:text-error-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredFacilities.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    onBook={handleBook}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              <div className="text-center">
                <Link to="/facilities">
                  <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl">
                    View All Facilities
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* stats */}
      <section className="py-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stat.number}</div>
                <div className="text-neutral-600 dark:text-neutral-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* benefits */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Experience the best facility booking service with features designed for your convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800 overflow-hidden"
              >
                <Card.Body className="p-8">
                  {/* icons */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {benefit.icon}
                  </div>

                  {/* title */}
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {benefit.title}
                  </h3>

                  {/* desc */}
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;