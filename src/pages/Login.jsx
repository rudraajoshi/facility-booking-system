import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      const success = await login(formData.email, formData.password);
      
      if (success) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting to dashboard...' });
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        setMessage({ type: 'error', text: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ type: 'error', text: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      const success = await login('guest@example.com', 'guest123');
      
      if (success) {
        setMessage({ type: 'success', text: 'Continuing as guest... Redirecting to dashboard...' });
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Guest account not available. Please sign up first.' 
        });
      }
    } catch (error) {
      console.error('Guest login error:', error);
      setMessage({ type: 'error', text: 'Login failed. Please try again.' });
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
          <p className="text-neutral-600">Sign in to access your bookings</p>
        </div>

        {/* login card */}
        <Card className="shadow-xl border-2 border-primary-100 animate-fade-in-up">
          <Card.Body className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              Welcome Back
            </h2>

            {/* msg */}
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
                placeholder="you@example.com"
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

              {/* pswd link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* btn */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign In
              </Button>
            </form>

            {/* divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500 font-medium">Or</span>
              </div>
            </div>

            {/* guest login */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGuestLogin}
              className="w-full group hover:bg-neutral-50"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Continue as Guest
              </span>
            </Button>

            {/* sign up link */}
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
            </div>
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
}

export default Login;