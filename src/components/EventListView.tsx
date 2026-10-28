import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Eye,
  Trash2
} from 'lucide-react';
import type { EventItem } from '../types/event';
import { formatCurrency } from '../utils/formatters';

interface EventListViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onEditEvent: (event: EventItem) => void;
  onDeleteEvent: (id: string) => void;
}

export const EventListView: React.FC<EventListViewProps> = ({
  events,
  onSelectEvent,
  onDeleteEvent
}) => {
  if (events.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
        border: '1px solid var(--border-light)',
        color: 'var(--text-secondary)'
      }}>
        <Calendar size={40} style={{ margin: '0 auto 0.75rem', color: 'var(--text-muted)' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          No se encontraron eventos
        </h3>
        <p style={{ fontSize: '0.85rem' }}>
          Probá ajustando el término de búsqueda o cambiando los filtros seleccionados.
        </p>
      </div>
    );
  }

  // Agrupar por Mes y Año
  const groupedEvents: { [key: string]: EventItem[] } = {};
  
  events.forEach(event => {
    const [year, month] = event.date.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthYear = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(dateObj);
    const capitalizedMonth = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    
    if (!groupedEvents[capitalizedMonth]) {
      groupedEvents[capitalizedMonth] = [];
    }
    groupedEvents[capitalizedMonth].push(event);
  });

  const getMonthAbbrAndDay = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const monthAbbr = new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(dateObj).replace('.', '');
    return {
      month: monthAbbr.toUpperCase(),
      day: parseInt(day)
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmado': return <span className="badge status-confirmado">Confirmado</span>;
      case 'prospecto': return <span className="badge status-prospecto">Borrador</span>;
      case 'en_curso': return <span className="badge status-en_curso">En Vivo</span>;
      case 'finalizado': return <span className="badge status-finalizado">Finalizado</span>;
      case 'cancelado': return <span className="badge status-cancelado">Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
        <div key={monthYear} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Cabecera del Mes */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 0.25rem'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              {monthYear}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {monthEvents.length} {monthEvents.length === 1 ? 'evento' : 'eventos'}
            </span>
          </div>

          {/* Lista de Filas de Eventos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {monthEvents.map((event) => {
              const { month, day } = getMonthAbbrAndDay(event.date);
              const totalPaid = event.payments.reduce((acc, p) => acc + p.amount, 0);
              const percentPaid = event.totalBudget > 0 ? Math.round((totalPaid / event.totalBudget) * 100) : 0;

              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem 1.4rem',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-card)',
                    display: 'grid',
                    gridTemplateColumns: '70px 60px minmax(220px, 2.5fr) minmax(130px, 1fr) minmax(140px, 1fr) 110px 90px',
                    alignItems: 'center',
                    gap: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* 1. Calendario Day Badge */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {month}
                    </span>
                    <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-accent)', marginTop: '0.15rem' }}>
                      {day}
                    </span>
                  </div>

                  {/* 2. Miniatura / Thumbnail */}
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--bg-subtle)',
                    flexShrink: 0
                  }}>
                    <img 
                      src={event.bannerImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80'} 
                      alt={event.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* 3. Título y Salón SMA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', overflow: 'hidden' }}>
                    <h4 style={{
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {event.title}
                    </h4>
                    <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      <MapPin size={13} color="var(--text-muted)" /> {event.venueName}
                    </span>
                  </div>

                  {/* 4. Asistentes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Asistentes
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--primary-accent)'
                      }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {event.expectedGuests} personas
                      </span>
                    </div>
                  </div>

                  {/* 5. Presupuesto */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Presupuesto (ARS)
                    </span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatCurrency(event.totalBudget)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: percentPaid >= 100 ? '#4ade80' : 'var(--text-muted)' }}>
                      {percentPaid}% cobrado
                    </span>
                  </div>

                  {/* 6. Status Badge */}
                  <div>
                    {getStatusBadge(event.status)}
                  </div>

                  {/* 7. Acciones */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(event);
                      }}
                      style={{
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      title="Ver ficha"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvent(event.id);
                      }}
                      style={{
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      title="Eliminar evento"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
