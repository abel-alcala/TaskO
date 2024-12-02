import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../CSS/Home.css";

export function TaskCalendar({ lists }) {
  const renderTileContent = ({ date }) => {
    const allTasks = Object.values(lists).flatMap((list) => list.tasks);
    const tasksForDate = allTasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate).toDateString() === date.toDateString(),
    );
    return tasksForDate.length > 0 ? (
      <ul className="calendar-tasks">
        {tasksForDate.map((task) => (
          <li key={task.taskID} className="calendar-task">
            {task.taskName}
          </li>
        ))}
      </ul>
    ) : null;
  };

  return <Calendar tileContent={renderTileContent} />;
}

export default TaskCalendar;
