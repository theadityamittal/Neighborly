import React, { useEffect, useRef, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import clsx from "clsx";
import "./CalendarPicker.css";

const CalendarPicker = ({ selectedDate, onSelect, unavailableDates = [], disableBeforeToday = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const pickerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unavailableSet = new Set(unavailableDates);
  console.log("Unavailable Dates:", unavailableDates);
  const isUnavailable = (date) => {
    const formatted = dayjs(date).format("YYYY-MM-DD");
    return unavailableSet.has(formatted);
  };

  const isBeforeToday = (date) => {
    return disableBeforeToday && dayjs().isAfter(date, "day");
  };

  const renderDay = (day, _value, DayComponentProps) => {
    const unavailable = isUnavailable(day);
    const tooEarly = isBeforeToday(day);

    return (
      <PickersDay
        {...DayComponentProps}
        disabled={unavailable || tooEarly}
        className={clsx(DayComponentProps.className, {
          "crossed-out-date": unavailable,
        })}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={selectedDate ? dayjs(selectedDate) : null}
        onChange={(newDate) =>
          onSelect(newDate ? newDate.format("YYYY-MM-DD") : null)
        }
        shouldDisableDate={(date) => isUnavailable(date) || isBeforeToday(date)}
        renderDay={renderDay}
        format="YYYY-MM-DD"
        slotProps={{
          textField: {
            size: 'small',
            fullWidth: true,
            placeholder: 'Select a date',
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CalendarPicker;