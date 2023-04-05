import { useCallback, useState, useRef, useEffect } from 'react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import './App.css';

const initialEvents = [
  {
    id: '1',
    calendarId: '2',
    title: 'Lunch',
    category: 'time',
    start: '2023-04-05T12:00:00',
    end: '2023-04-05T13:30:00',
  },
  {
    id: '2',
    calendarId: '2',
    title: 'Coffee Break',
    category: 'time',
    start: '2023-04-05T15:00:00',
    end: '2023-04-05T15:30:00',
  },
];

export default function App() {
  const [calendarEvents, setCalendarEvents] = useState(initialEvents);

  const calendar = useRef();

  const options = {
    useFormPopup: true,
    useDetailPopup: true,
    view: 'day'
  };

  const futureTasks = [
    {
      id:'0',
      title: 'Call Sandra',
      calendarId: '0',
    },
    {
      id:'1',
      title: 'Call Julia',
      calendarId: '1',
    }
  ] 

  const possibleCalendars = [
    {
      id: '0',
      name: 'Reserved Call',
      backgroundColor: '#9e5fff',
      borderColor: '#9e5fff',
      dragBackgroundColor: '#9e5fff',
    },
    {
      id: '1',
      name: 'Optional Call',
      backgroundColor: '#00a9ff',
      borderColor: '#00a9ff',
      dragBackgroundColor: '#00a9ff',
    },
    {
      id: '2',
      name: 'Task',
      backgroundColor: '#ffc501',
      borderColor: '#ffc501',
      dragBackgroundColor: '#ffc501',
    }
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
      isPending: eventData.isPending,
      isReadOnly: eventData.isReadOnly
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

  function handleDragStart(e, task) {
    const data = JSON.stringify(task);
    e.dataTransfer.setData("text/plain", data);
    console.log('dragstart:', data);
  }
  const handleDragOver = useCallback((e) => {
    e.preventDefault(); 
    e.stopPropagation();
    return false;
  }, [])
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('text'));
      console.log('onDrop:', data)
      onBeforeCreateEvent(data);
    
  }, [])

  useEffect(() => {
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    return () => {
        window.removeEventListener('dragover', handleDragOver);
        window.removeEventListener('drop', handleDrop);
    };
}, [handleDragOver, handleDrop]);

  return (
    <>
      <h1>📅</h1>
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
      </div>

      <div>
        <ul>
          {futureTasks.map((task, i) => {
            return <li key={task.title + i} draggable 
            className='draggable'
            onDragStart={(e) => handleDragStart(e, task)}
           >{task.title}</li>
          })}
        </ul>
      </div>
          
      <Calendar
        className='dropzone'
        ref={calendar}
        calendars={possibleCalendars}
        {...options}
        height="900px"
        events={calendarEvents}
        onBeforeUpdateEvent={onBeforeUpdateEvent}
        onBeforeCreateEvent={onBeforeCreateEvent}
        onBeforeDeleteEvent={onBeforeDeleteEvent}
      
        onDragOver={(e) => {
          handleDragOver(e)
        }}
        onDrop={(e) => {
          handleDrop(e);
        }}
    />
    </>
  );
}