import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format, addDays, isWithinInterval, isSameDay } from 'date-fns';

const DateRangePicker = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, endDate] = value;
  const [hoveredDate, setHoveredDate] = useState(null);

  const handleDateHover = (date) => {
    setHoveredDate(date);
  };

  const handleDateSelect = (date) => {
    if (!startDate) {
      onChange([date, null]);
    } else if (!endDate || isSameDay(date, startDate)) {
      onChange([date, null]);
    } else {
      onChange([startDate, date]);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange([null, null]);
    setIsOpen(false);
  };

  const generateCalendarDays = () => {
    const days = [];
    let currentDate = startDate || new Date();

    // Generate 6 weeks (42 days) starting from the first day of the current month
    for (let i = 0; i < 42; i++) {
      days.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button className={className}>
          {startDate && endDate
            ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
            : 'Select date range'}
          <Calendar className="ml-2 h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 space-y-4 w-full max-w-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Select Date Range</h3>
          <Button variant="ghost" onClick={handleClear}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {generateCalendarDays().map((day, index) => (
            <div
              key={index}
              className={`
                p-2 rounded-md cursor-pointer
                ${isSameDay(day, startDate) ? 'bg-blue-500 text-white' : ''}
                ${isSameDay(day, endDate) ? 'bg-blue-500 text-white' : ''}
                ${isWithinInterval(day, { start: startDate, end: hoveredDate || endDate }) ? 'bg-blue-100' : ''}
              `}
              onMouseEnter={() => handleDateHover(day)}
              onClick={() => handleDateSelect(day)}
            >
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;