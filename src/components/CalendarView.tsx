import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon
} from 'lucide-react';
import type { EventItem } from '../types/event';

interface CalendarViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onCreateEvent: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onSelectEvent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Noviembre 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Primer día del mes y total de días
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 es Domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Mapear eventos por día en formato "YYYY-MM-DD"
  const getEventsForDay = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    return events.filter(e => e.date === dateStr);
  };

  const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Cabecera del Calendario */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-2xl)',
        padding: '1.25rem 1.75rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'var(--primary-subtle)',
            color: 'var(--primary-accent)',
            padding: '0.65rem',
            borderRadius: '14px'
          }}>
            <CalendarIcon size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {monthNames[month]} {year}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Calendario de ocupación y fechas de eventos en San Martín de los Andes
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={handlePrevMonth}
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              display: 'flex'
            }}
            title="Mes Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            Hoy
          </button>
          <button
            onClick={handleNextMonth}
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              display: 'flex'
            }}
            title="Mes Siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grilla del Calendario Mensual */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-2xl)',
        padding: '1.25rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          {dayHeaders.map((dh, i) => (
            <div key={i} style={{ padding: '0.65rem 0', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {dh}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} style={{ minHeight: '110px', background: 'var(--bg-subtle)', opacity: 0.35, borderRadius: 'var(--radius-lg)' }} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = getEventsForDay(dayNum);
            const isToday = new Date().getDate() === dayNum && new Date().getMonth() === month && new Date().getFullYear() === year;

            return (
              <div
                key={`day-${dayNum}`}
                style={{
                  minHeight: '110px',
                  background: isToday ? 'var(--primary-subtle)' : 'var(--bg-subtle)',
                  border: isToday ? '1px solid var(--primary-accent)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isToday ? 'var(--primary-accent)' : 'transparent',
                    color: isToday ? '#ffffff' : 'var(--text-main)'
                  }}>
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
                      {dayEvents.length} evt
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
                  {dayEvents.map(evt => (
                    <div
                      key={evt.id}
                      onClick={() => onSelectEvent(evt)}
                      style={{
                        padding: '0.3rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-accent)',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        boxShadow: '0 2px 4px rgba(249, 95, 53, 0.25)'
                      }}
                      title={`${evt.title} - ${evt.venueName}`}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
