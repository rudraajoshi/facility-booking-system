import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Link } from 'react-router-dom';

function AboutUs() {
  const stats = [
    { label: 'Active Facilities', value: '10' },
    { label: 'Happy Customers', value: '500+' },
    { label: 'Bookings Made', value: '10,000+' },
    { label: 'Cities Covered', value: '20+' }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Speed & Efficiency',
      description: 'Book your perfect facility in seconds with our streamlined booking process.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Trust & Reliability',
      description: 'Verified facilities and secure payments ensure peace of mind for every booking.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Customer First',
      description: '24/7 support and flexible booking options to meet your unique needs.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Innovation',
      description: 'Cutting-edge technology to make facility booking simple and accessible.'
    }
  ];

  const features = [
    {
      title: 'Wide Selection',
      description: 'Access hundreds of conference rooms, meeting spaces, and training facilities across multiple cities.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: 'Instant Booking',
      description: 'Real-time availability and instant confirmation for hassle-free reservations.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Flexible Pricing',
      description: 'Transparent hourly rates with no hidden fees. Pay only for what you need.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Easy Management',
      description: 'Manage all your bookings from one dashboard with modification and cancellation options.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* hero section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Facility Booking System
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              Revolutionizing the way businesses book conference rooms, meeting spaces, and training facilities. Simple, fast, and reliable.
            </p>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-custom py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* our story */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <Card.Body className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6 text-center">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none text-neutral-700 space-y-4">
                <p>
                  Founded in 2020, Facility Booking System was born from a simple observation: booking meeting spaces and conference rooms was unnecessarily complicated. Businesses were wasting valuable time navigating complex booking systems, dealing with unclear pricing, and managing facilities across multiple platforms.
                </p>
                <p>
                  We set out to change that. Our mission is to make facility booking as simple as ordering a ride or booking a hotel. With just a few clicks, businesses can discover, compare, and book the perfect space for their needs.
                </p>
                <p>
                  Today, we're proud to serve thousands of businesses across 25+ cities, offering access to hundreds of verified facilities. From small startups to large enterprises, our platform helps teams find the right space at the right time, every time.
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* vision-mission */}
      <div className="bg-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <Card.Body className="p-8">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  To simplify facility booking for businesses of all sizes, providing instant access to quality spaces with transparent pricing and exceptional service. We believe every meeting deserves the perfect space.
                </p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="p-8">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Our Vision
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  To become the world's most trusted platform for facility booking, where every business can find and reserve their ideal space in seconds, fostering productivity and collaboration everywhere.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* core values */}
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <Card.Body className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-neutral-600">
                  {value.description}
                </p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* services */}
      <div className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Everything you need for seamless facility booking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <Card.Body className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-600">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* cta */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of businesses who trust us for their facility booking needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/facilities">
                <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-neutral-100">
                  Browse Facilities
                </Button>
              </Link>
              <Link to="/contact-us">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* stats/trust */}
      <div className="container-custom py-16">
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Trusted by Leading Organizations
            </h3>
            <p className="text-neutral-600 mb-6">
              From startups to Fortune 500 companies, businesses across industries rely on our platform for their facility booking needs. Experience the difference of a truly modern booking solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-600">
              <span className="px-4 py-2 bg-white rounded-lg border border-neutral-200">✓ Verified Facilities</span>
              <span className="px-4 py-2 bg-white rounded-lg border border-neutral-200">✓ Secure Payments</span>
              <span className="px-4 py-2 bg-white rounded-lg border border-neutral-200">✓ 24/7 Support</span>
              <span className="px-4 py-2 bg-white rounded-lg border border-neutral-200">✓ Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;