import { useCallback, useRef } from 'react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import './App.css';

export default function App() {

  const calendar = useRef();

  const options = {
    useFormPopup: true,
    useDetailPopup: true,
    view: 'day',
    
};

  const initialEvents = [
    {
      id: '1',
      calendarId: 'cal1',
      title: 'Lunch',
      category: 'time',
      start: '2023-04-04T12:00:00',
      end: '2023-04-04T13:30:00',
    },
    {
      id: '2',
      calendarId: 'cal1',
      title: 'Coffee Break',
      category: 'time',
      start: '2023-04-04T15:00:00',
      end: '2023-04-04T15:30:00',
    },
  ];

  
  const onBeforeCreateEvent = (eventData) => {
    const event = {
      calendarId: eventData.calendarId || '',
      id: String(Math.random()),
      title: eventData.title,
      isAllday: eventData.isAllday,
      start: eventData.start,
      end: eventData.end,
      category: eventData.isAllday ? 'allday' : 'time',
      dueDateClass: '',
      location: eventData.location,
      state: eventData.state,
      isPrivate: eventData.isPrivate,
    };
    calendar.current.calendarInstance.createEvents([event]);
  };

  const onBeforeDeleteEvent = (res) => {
    console.group('onBeforeDeleteEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();
    const { id, calendarId } = res;
    calendar.current.calendarInstance.deleteEvent(id, calendarId);
  };

  const onBeforeUpdateEvent = (updateData) => {
    console.group('onBeforeUpdateEvent');
    console.log(updateData);
    console.groupEnd();

    const targetEvent = updateData.event;
    const changes = { ...updateData.changes };
    calendar.current.calendarInstance.updateEvent(targetEvent.id, targetEvent.calendarId, changes);
  };

  // move through days
  function moveToNextOrPrevRange(offset) {
    calendar.current.calendarInstance.move(offset)
  }
  
  function onClickTodayBtn() {
    calendar.current.calendarInstance.today();
  }

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
        events={initialEvents}
        onBeforeUpdateEvent={onBeforeUpdateEvent}
        onBeforeCreateEvent={onBeforeCreateEvent}
        onBeforeDeleteEvent={onBeforeDeleteEvent}
    />
    </>
  );
}