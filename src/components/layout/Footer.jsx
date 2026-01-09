import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* brand */}
          <div>
            <h3 className="text-white font-display font-bold text-lg mb-3">
              Facility Booking System
            </h3>
            <p className="text-sm text-neutral-400">
              Easy and efficient facility booking for your organization.
            </p>
          </div>

          {/* quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-primary-400 transition-colors">
                  Browse Facilities
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-primary-400 transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* support */}
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* legal */}
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom */}
        <div className="border-t border-neutral-700 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Facility Booking System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;