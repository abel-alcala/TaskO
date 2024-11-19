import React, { useState, useEffect } from "react";

function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState("PST"); // Default timezone

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function formatTime() {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: timeZone,
    };
    return new Intl.DateTimeFormat("en-US", options).format(time);
  }

  function handleTimeZoneChange(event) {
    setTimeZone(event.target.value);
  }

  return (
    <div className="clock-container">
      <div className="clock">
        <span>{formatTime()}</span>

        <select
          className="timezone-select"
          value={timeZone}
          onChange={handleTimeZoneChange}
        >
          <option value="UTC">UTC</option>
          <option value="America/Los_Angeles">PST (Pacific)</option>
          <option value="America/Denver">MST (Mountain)</option>
          <option value="America/Chicago">CST (Central)</option>
          <option value="America/New_York">EST (Eastern)</option>
        </select>
      </div>
    </div>
  );
}

export default DigitalClock;
