import Calaendar from '@/components/Calaendar';

const CalendarPage = () => {
  // mockup data
  const schedules = [
    {
      id: '1schedule',
      title: 'test',
      startDate: new Date(2024, 7, 1),
      endDate: new Date(2024, 7, 4),
      description: 'test',
      color: '#5fa1ed',
    },
    {
      id: '2schedule',
      title: 'test2',
      startDate: new Date(2024, 7, 2),
      endDate: new Date(2024, 7, 7),
      description: 'test2',
      color: '#2bab75',
    },
    {
      id: '5schedule',
      title: 'test6',
      startDate: new Date(2024, 7, 6),
      endDate: new Date(2024, 7, 9),
      description: 'test2',
      color: '#e1ae1a',
    },
    // {
    //   id: '7schedule',
    //   title: 'test3ddd',
    //   startDate: new Date(2024, 7, 4),
    //   endDate: new Date(2024, 7, 5),
    //   description: 'test555',
    //   color: '#e1ae1a',
    // },
    {
      id: '3schedule',
      title: 'test3',
      startDate: new Date(2024, 7, 5),
      endDate: new Date(2024, 7, 8),
      description: 'test2',
      color: '#e1ae1a',
    },
    {
      id: '4schedule',
      title: 'test4',
      startDate: new Date(2024, 7, 10),
      endDate: new Date(2024, 7, 11),
      description: 'test2',
      color: '#e1ae1a',
    },
  ];

  return (
    <section className="w-full h-full">
      <Calaendar
        style={{
          width: '100%',
          height: '100%',
        }}
        schedules={schedules}
      />
    </section>
  );
};

export default CalendarPage;
