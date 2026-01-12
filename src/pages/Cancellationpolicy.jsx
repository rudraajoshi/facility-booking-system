import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

function CancellationPolicy() {
  const policyHighlights = [
    {
      icon: '✅',
      title: 'Free Cancellation',
      description: 'Cancel 24+ hours before your booking',
      badge: '100% Refund',
      badgeVariant: 'success'
    },
    {
      icon: '⚠️',
      title: 'Late Cancellation',
      description: 'Cancel within 24 hours of booking',
      badge: '50% Refund',
      badgeVariant: 'warning'
    },
    {
      icon: '❌',
      title: 'No-Show',
      description: 'Failure to show up for booking',
      badge: 'No Refund',
      badgeVariant: 'error'
    },
  ];

  const scenarios = [
    {
      title: 'Booking Modified',
      description: 'If you need to change your booking date, time, or facility',
      rules: [
        'Modifications allowed up to 24 hours before booking',
        'Subject to availability of new time slot',
        'Price differences may apply',
        'No fees for date/time changes within policy'
      ]
    },
    {
      title: 'Weather Emergencies',
      description: 'In case of severe weather or natural disasters',
      rules: [
        'Full refund or free rescheduling option',
        'We will notify you at least 2 hours in advance',
        'Official weather warnings determine eligibility',
        'Photo/video evidence may be required'
      ]
    },
    {
      title: 'Facility Issues',
      description: 'If facility is unavailable due to maintenance or issues',
      rules: [
        'Full refund automatically processed',
        'Alternative facility offered if available',
        'Notification sent as soon as issue is identified',
        'Compensation may be provided for inconvenience'
      ]
    },
    {
      title: 'Group Bookings',
      description: 'Special considerations for bookings of 3+ facilities',
      rules: [
        'Extended cancellation period (48 hours)',
        'Partial cancellations allowed',
        'Customized refund policy available',
        'Contact support for group booking changes'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Cancellation Policy
          </h1>
          <p className="text-xl text-primary-100 text-center max-w-2xl mx-auto">
            Everything you need to know about canceling or modifying your booking
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Policy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {policyHighlights.map((item, index) => (
            <Card key={index}>
              <Card.Body>
                <div className="text-center">
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    {item.description}
                  </p>
                  <Badge variant={item.badgeVariant} className="text-sm">
                    {item.badge}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Detailed Policy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>Standard Cancellation Terms</Card.Title>
              </Card.Header>
              <Card.Body className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                    1. Cancellation Timeframes
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-neutral-800">
                          More than 24 hours before booking
                        </h4>
                        <p className="text-sm text-neutral-600">
                          Full refund of 100% will be issued to your original payment method within 5-7 business days.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-warning-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-neutral-800">
                          Within 24 hours of booking
                        </h4>
                        <p className="text-sm text-neutral-600">
                          50% cancellation fee applies. The remaining 50% will be refunded within 5-7 business days.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-error-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-neutral-800">
                          No-show or same-day cancellation
                        </h4>
                        <p className="text-sm text-neutral-600">
                          No refund will be provided. The full booking amount is forfeited.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                    2. How to Cancel
                  </h3>
                  <ol className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary-600">1.</span>
                      <span>Log in to your account and navigate to "My Bookings"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary-600">2.</span>
                      <span>Find the booking you want to cancel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary-600">3.</span>
                      <span>Click "Cancel Booking" and confirm your cancellation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary-600">4.</span>
                      <span>You'll receive a confirmation email with refund details</span>
                    </li>
                  </ol>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                    3. Refund Processing
                  </h3>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>
                      <strong>Processing Time:</strong> Refunds are typically processed within 5-7 business days.
                    </p>
                    <p>
                      <strong>Payment Method:</strong> Refunds are issued to your original payment method.
                    </p>
                    <p>
                      <strong>Bank Processing:</strong> Depending on your bank, it may take an additional 2-5 business days for the refund to appear in your account.
                    </p>
                    <p>
                      <strong>Confirmation:</strong> You'll receive an email once the refund has been processed.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Special Scenarios */}
            <Card>
              <Card.Header>
                <Card.Title>Special Scenarios</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {scenarios.map((scenario, index) => (
                    <div key={index} className={index > 0 ? 'border-t border-neutral-200 pt-6' : ''}>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                        {scenario.title}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-3">
                        {scenario.description}
                      </p>
                      <ul className="space-y-1">
                        {scenario.rules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                            <svg className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Important Notes */}
            <Card className="border-error-200 bg-error-50">
              <Card.Header>
                <Card.Title className="text-error-800">Important Notes</Card.Title>
              </Card.Header>
              <Card.Body>
                <ul className="space-y-2 text-sm text-error-700">
                  <li className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>Cancellation fees are non-negotiable except in cases of emergency or facility issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>Multiple no-shows may result in account suspension or booking restrictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>Partial refunds for shortened bookings are not available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>This policy is subject to change. Check before each booking</span>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Reference */}
            <Card>
              <Card.Header>
                <Card.Title>Quick Reference</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-semibold text-neutral-800 mb-1">Cancellation Deadline</div>
                    <div className="text-neutral-600">24 hours before booking</div>
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="font-semibold text-neutral-800 mb-1">Refund Timeline</div>
                    <div className="text-neutral-600">5-7 business days</div>
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="font-semibold text-neutral-800 mb-1">Modification Fee</div>
                    <div className="text-neutral-600">Free (if within policy)</div>
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="font-semibold text-neutral-800 mb-1">No-Show Policy</div>
                    <div className="text-neutral-600">No refund</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Contact Support */}
            <Card className="bg-primary-50 border-primary-200">
              <Card.Body>
                <div className="text-center">
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="font-semibold text-neutral-800 mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Have questions about our cancellation policy?
                  </p>
                  <a href="/contact-us">
                    <button className="btn btn-primary btn-sm w-full">
                      Contact Support
                    </button>
                  </a>
                </div>
              </Card.Body>
            </Card>

            {/* Related Links */}
            <Card>
              <Card.Header>
                <Card.Title>Related Information</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="space-y-2">
                  <a href="/faqs" className="block text-sm text-primary-600 hover:underline">
                    → FAQs
                  </a>
                  <a href="/help-center" className="block text-sm text-primary-600 hover:underline">
                    → Help Center
                  </a>
                  <a href="/contact-us" className="block text-sm text-primary-600 hover:underline">
                    → Contact Us
                  </a>
                  <a href="#" className="block text-sm text-primary-600 hover:underline">
                    → Terms of Service
                  </a>
                  <a href="#" className="block text-sm text-primary-600 hover:underline">
                    → Privacy Policy
                  </a>
                </div>
              </Card.Body>
            </Card>

            {/* Last Updated */}
            <div className="text-xs text-neutral-500 text-center p-4 bg-neutral-100 rounded-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancellationPolicy;