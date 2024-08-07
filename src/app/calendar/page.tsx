import Calaendar from '@/components/Calaendar';

const CalendarPage = () => {
  return (
    <section className="w-full h-full">
      <Calaendar
        style={{
          width: '100%',
          height: '100%',
        }}
        schedules={[]}
      />
    </section>
  );
};

export default CalendarPage;
