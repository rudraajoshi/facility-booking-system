// src/components/booking/Calendar.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';

const Calendar = ({ facilityId, onDateSelect, existingBookings = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // available time slots
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // calendar data
  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getCalendarData();

  // navigate
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  // past data
  const isPastDate = (day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // today's data
  const isToday = (day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // selected date
  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  // handle data click
  const handleDateClick = (day) => {
    if (isPastDate(day)) return;
    
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  // format data to string
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // check if selected time slot is booked
  const isTimeSlotBooked = (timeSlot) => {
    if (!selectedDate) return false;
    
    const dateKey = formatDate(selectedDate);
    const bookedSlots = existingBookings[dateKey] || [];
    return bookedSlots.includes(timeSlot);
  };

  // handle time slot selection
  const handleTimeSlotClick = (timeSlot) => {
    if (isTimeSlotBooked(timeSlot)) return;
    
    setSelectedTimeSlot(timeSlot);
    
    if (onDateSelect && selectedDate) {
      onDateSelect({
        date: formatDate(selectedDate),
        time: timeSlot,
        dateObject: selectedDate
      });
    }
  };

  // generate calendar days
  const renderCalendarDays = () => {
    const days = [];
    
    // empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }
    
    // actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const past = isPastDate(day);
      const today = isToday(day);
      const selected = isSelected(day);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={past}
          className={`
            aspect-square rounded-lg font-medium text-sm transition-all
            ${past 
              ? 'text-neutral-300 cursor-not-allowed' 
              : 'hover:bg-primary-50 cursor-pointer'
            }
            ${today && !selected
              ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
              : ''
            }
            ${selected
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'text-neutral-700'
            }
            ${!past && !today && !selected
              ? 'hover:ring-2 hover:ring-primary-200'
              : ''
            }
          `}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header className="border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <Card.Title>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Availability Calendar
              </div>
            </Card.Title>
          </div>
        </Card.Header>

        <Card.Body className="space-y-6">
          {/* calendar header */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-800">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={goToToday}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Today
              </button>
            </div>

            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* day names */}
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-neutral-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>

          {/* legend */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-primary-100 ring-2 ring-primary-500"></div>
              <span className="text-neutral-600">Today</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-primary-600"></div>
              <span className="text-neutral-600">Selected</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-neutral-200"></div>
              <span className="text-neutral-600">Past</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Ttime slots => visible when date is selected */}
      {selectedDate && (
        <Card>
          <Card.Header className="border-b border-neutral-200">
            <Card.Title>
              Available Time Slots - {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </Card.Title>
          </Card.Header>

          <Card.Body>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {timeSlots.map((slot) => {
                const booked = isTimeSlotBooked(slot);
                const selected = selectedTimeSlot === slot;

                return (
                  <button
                    key={slot}
                    onClick={() => handleTimeSlotClick(slot)}
                    disabled={booked}
                    className={`
                      px-4 py-3 rounded-lg font-medium text-sm transition-all
                      ${booked
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed line-through'
                        : selected
                        ? 'bg-primary-600 text-white ring-2 ring-primary-500'
                        : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
                      }
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            {selectedTimeSlot && (
              <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-success-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-success-900">Time Slot Selected</p>
                    <p className="text-sm text-success-700 mt-1">
                      {selectedDate.toLocaleDateString()} at {selectedTimeSlot}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

Calendar.propTypes = {
  facilityId: PropTypes.string,
  onDateSelect: PropTypes.func,
  existingBookings: PropTypes.object
};

export default Calendar;
