import Card from '../common/Card';
import PropTypes from 'prop-types';
const StepIndicator = ({ currentStep }) => {
  return (
    <Card className="mb-6">
      <Card.Body>
        <div className="flex items-center justify-between">
          {/* step 1 */}
          <div className="flex items-center flex-1">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'}
            `}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <div className="ml-3 hidden sm:block">
              <div className="text-sm font-semibold text-neutral-800">Date & Time</div>
              <div className="text-xs text-neutral-500">Select your slot</div>
            </div>
          </div>
          <div className={`h-1 flex-1 mx-4 ${currentStep > 1 ? 'bg-primary-600' : 'bg-neutral-200'}`}></div>
          {/* step 2 */}
          <div className="flex items-center flex-1">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'}
            `}>
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <div className="ml-3 hidden sm:block">
              <div className="text-sm font-semibold text-neutral-800">Details</div>
              <div className="text-xs text-neutral-500">Add information</div>
            </div>
          </div>
          <div className={`h-1 flex-1 mx-4 ${currentStep > 2 ? 'bg-primary-600' : 'bg-neutral-200'}`}></div>
          {/* step 3 */}
          <div className="flex items-center flex-1">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'}
            `}>
              3
            </div>
            <div className="ml-3 hidden sm:block">
              <div className="text-sm font-semibold text-neutral-800">Confirm</div>
              <div className="text-xs text-neutral-500">Review & submit</div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired
};

export default StepIndicator;