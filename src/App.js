import { useCallback, useRef } from 'react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import './App.css';

export default function App() {

  const calendar = useRef();
  /* const calendar = new Calendar('#container', {
    useFormPopup: true,
    useDetailPopup: true,
    defaultView: 'day',
  }); */

  const options = {
    useFormPopup: true,
    useDetailPopup: true,
    view: 'day',
    
};
  const calendars = [{ id: 'cal1', name: 'Personal' }];
  const initialEvents = [
    {
      id: '1',
      calendarId: 'cal1',
      title: 'Lunch',
      category: 'time',
      start: '2023-04-10T12:00:00',
      end: '2023-04-10T13:30:00',
    },
    {
      id: '2',
      calendarId: 'cal1',
      title: 'Coffee Break',
      category: 'time',
      start: '2023-04-28T15:00:00',
      end: '2023-04-28T15:30:00',
    },
  ];

  function moveToNextOrPrevRange(offset) {
    calendar.current.calendarInstance.move(offset)
  }
  
  function onClickTodayBtn() {
    calendar.today();
  }

  const onClickNav = (ev) => {
    if ((ev.target).tagName === 'BUTTON') {
      const button = ev.target;
      const actionName = (button.getAttribute('data-action') ?? 'month').replace('move-', '');
    }
  };

  return (
    <>
      <h1>🍞📅 TOAST UI Calendar + React.js</h1>
      <div>
        <span>
          <button
            type="button"
            className="btn btn-default btn-sm move-today"
            data-action="move-today"
            onClick={onClickTodayBtn}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            data-action="move-prev"
            onClick={() => moveToNextOrPrevRange(-1)}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            data-action="move-next"
            onClick={() => moveToNextOrPrevRange(1)}
          >
            Next
          </button>
        </span>
        <span className="render-range">selectedDateRangeText</span>
      </div>

      <Calendar
        ref={calendar}
        {...options}
        height="900px"
        calendars={calendars}
        events={initialEvents}
    />
    </>
  );
}