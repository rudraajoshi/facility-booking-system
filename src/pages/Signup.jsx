import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // clear error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    const success = await signup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
    
    if (success) {
      setMessage({ type: 'success', text: 'Account created successfully!' });
      setTimeout(() => navigate('/facilities', { replace: true }), 1000);
    } else {
      setMessage({ type: 'error', text: 'Signup failed. Please try again.' });
    }
  } catch (error) {
    setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
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
          <p className="text-neutral-600">Create your account to get started</p>
        </div>

        {/* signup */}
        <Card className="shadow-xl border-2 border-primary-100 animate-fade-in-up">
          <Card.Body className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              Create Account
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
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                error={errors.name}
                required
                className="border-2 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              />

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
                label="Phone Number (Optional)"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="1234567890"
                error={errors.phone}
                className="border-2 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                error={errors.password}
                required
                className="border-2 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                error={errors.confirmPassword}
                required
                className="border-2 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              />

              {/* T&C */}
              <div className="text-sm text-neutral-600">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                  Privacy Policy
                </Link>
              </div>

              {/* button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Account
              </Button>
            </form>

            {/* login */}
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* home */}
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

export default Signup;