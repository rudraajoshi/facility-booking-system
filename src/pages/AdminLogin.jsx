import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const success = await login(formData.email, formData.password, 'admin');
      
      if (success) {
        setMessage({ type: 'success', text: 'Admin login successful! Redirecting to dashboard...' });
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
      } else {
        setMessage({ type: 'error', text: 'Invalid admin credentials' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred during login. Please try again.' });
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-display font-bold text-primary-600 mb-2">
              Facility Booking
            </h1>
          </Link>
          <p className="text-neutral-600">Admin Portal - Access Dashboard</p>
        </div>

        {/* login card */}
        <Card className="shadow-xl border-2 border-primary-100 animate-fade-in-up">
          <Card.Body className="p-8">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-semibold">Admin Access</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              Welcome Back
            </h2>

            {/* message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg border-2 ${
                message.type === 'success' 
                  ? 'bg-success-50 border-success-200 text-success-700' 
                  : 'bg-error-50 border-error-200 text-error-700'
              } animate-fade-in`}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {message.type === 'success' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                  <span className="font-medium">{message.text}</span>
                </div>
              </div>
            )}

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@facility.com"
                error={errors.email}
                required
                className="border-2 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                required
                className="border-2 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              />

              {/* password link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign In as Admin
              </Button>
            </form>

            {/* divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500 font-medium">Not an admin?</span>
              </div>
            </div>

            {/* customer login button */}
            <Link to="/login">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full group hover:bg-neutral-50"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Login
                </span>
              </Button>
            </Link>
          </Card.Body>
        </Card>
        {/* back to home */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;