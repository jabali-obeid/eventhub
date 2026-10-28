import React from 'react';
import { Calendar, DollarSign, Users, Clock } from 'lucide-react';
import type { EventItem } from '../types/event';
import { formatCurrency } from '../utils/formatters';

interface StatsOverviewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ events, onSelectEvent }) => {
  const confirmedEvents = events.filter(e => e.status === 'confirmado' || e.status === 'en_curso');
  
  const totalBudgetConfirmed = confirmedEvents.reduce((acc, curr) => acc + curr.totalBudget, 0);
  
  const totalCollected = confirmedEvents.reduce((acc, curr) => {
    const paid = curr.payments.reduce((pAcc, p) => pAcc + p.amount, 0);
    return acc + paid;
  }, 0);

  const pendingCollection = totalBudgetConfirmed - totalCollected;

  const sortedUpcoming = [...events]
    .filter(e => e.status !== 'finalizado' && e.status !== 'cancelado')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextEvent = sortedUpcoming[0];
  const totalGuests = confirmedEvents.reduce((acc, curr) => acc + curr.expectedGuests, 0);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '1.75rem'
    }}>
      {/* Tarjeta 1 */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Eventos en Cartera
          </span>
          <div style={{
            background: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            padding: '0.45rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            <Calendar size={16} />
          </div>
        </div>
        <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {events.length}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 600 }}>
            {confirmedEvents.length} confirmados
          </span>
        </div>
      </div>

      {/* Tarjeta 2 */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Percibido
          </span>
          <div style={{
            background: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            padding: '0.45rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            <DollarSign size={16} />
          </div>
        </div>
        <div style={{ marginTop: '0.6rem' }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {formatCurrency(totalCollected)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            <span>Resta cobrar:</span>
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>{formatCurrency(pendingCollection)}</span>
          </div>
        </div>
      </div>

      {/* Tarjeta 3 */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Aforo Total
          </span>
          <div style={{
            background: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            padding: '0.45rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            <Users size={16} />
          </div>
        </div>
        <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {totalGuests.toLocaleString('es-AR')}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            personas
          </span>
        </div>
      </div>

      {/* Tarjeta 4: Próximo */}
      {nextEvent && (
        <div 
          onClick={() => onSelectEvent(nextEvent)}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
            e.currentTarget.style.borderColor = 'var(--primary-border)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-card)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} /> Próximo Evento
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{nextEvent.date}</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <h4 style={{ 
              fontSize: '0.92rem', 
              fontWeight: 700, 
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {nextEvent.title}
            </h4>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              📍 {nextEvent.venueName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
