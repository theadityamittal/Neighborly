import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CalendarPicker.css";

const CalendarPicker = ({
  unavailableDates = [],
  selectedDate,
  onSelect,
  disableBeforeToday = false,
}) => {
  const today = new Date();

  // Ensure unavailableDates are Date objects
  // (Assuming they are already Date objects; if not, convert them here.)

  // Function to determine if a date is selectable
  const isDateAvailable = (date) => {
    // If disableBeforeToday is true, disable dates before today
    if (disableBeforeToday && date < today) return false;
    // Disable any date that matches an unavailable date
    return !unavailableDates.some(
      (unavailableDate) =>
        unavailableDate instanceof Date &&
      date.toDateString() === unavailableDate.toDateString()
    );
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => onSelect(date)}
      filterDate={isDateAvailable}
      placeholderText="Select a date"
      className="calendar-picker-input"
    />
  );
};

export default CalendarPicker;