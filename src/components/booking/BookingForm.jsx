import { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const BookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    facility: '',
    date: '',
    time: '',
    duration: '',
    purpose: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Quick Booking</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="space-y-4">
          <Input
            label="Facility"
            type="select"
            name="facility"
            value={formData.facility}
            onChange={handleChange}
          >
            <option>Select a facility</option>
            <option>Conference Room A</option>
            <option>Meeting Room B</option>
            <option>Training Hall</option>
          </Input>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <Input
              label="Time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Duration (hours)"
            type="number"
            name="duration"
            placeholder="2"
            min="1"
            value={formData.duration}
            onChange={handleChange}
          />

          <Input
            label="Purpose"
            type="textarea"
            name="purpose"
            placeholder="Describe your booking purpose..."
            value={formData.purpose}
            onChange={handleChange}
          />

          <Button type="button" className="w-full" onClick={handleSubmit}>
            Check Availability
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookingForm;