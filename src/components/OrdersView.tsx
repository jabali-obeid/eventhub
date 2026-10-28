import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import type { EventItem, SupplierItem } from '../types/event';
import { formatCurrency, formatDateSpanish } from '../utils/formatters';

interface OrdersViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ events, onSelectEvent }) => {
  // Extraer todos los proveedores contratados en los eventos con su contexto
  const allOrders: Array<SupplierItem & { eventTitle: string; eventDate: string; eventId: string; eventCategory: string }> = [];

  events.forEach(e => {
    e.suppliers.forEach(s => {
      allOrders.push({
        ...s,
        eventTitle: e.title,
        eventDate: e.date,
        eventId: e.id,
        eventCategory: e.category
      });
    });
  });

  const totalContracted = allOrders.reduce((acc, curr) => acc + curr.cost, 0);
  const confirmedCount = allOrders.filter(o => o.confirmed).length;
  // Calculamos estimación de pagado según los gastos asociados o seña del 50%
  const totalPaid = allOrders.reduce((acc, curr) => acc + (curr.confirmed ? curr.cost * 0.5 : 0), 0);
  const totalPending = totalContracted - totalPaid;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner & KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{
          background: 'var(--primary-accent)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.35rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, opacity: 0.9 }}>Total Contrataciones SMA</span>
            <Building2 size={18} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
            {formatCurrency(totalContracted)}
          </div>
          <span style={{ fontSize: '0.74rem', opacity: 0.85, marginTop: '0.2rem', display: 'block' }}>
            {allOrders.length} contratos en salones y servicios
          </span>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.35rem',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Señas y Anticipos Abonados</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
            {formatCurrency(totalPaid)}
          </div>
          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>
            {confirmedCount} contratos confirmados
          </span>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.35rem',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Saldo Pendiente a Proveedores</span>
            <AlertCircle size={18} color="var(--primary-accent)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
            {formatCurrency(totalPending)}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
            Compromisos bancarios en BPN
          </span>
        </div>
      </div>

      {/* Tabla de Contrataciones Activas con Estilo Finexy */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-2xl)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Contratos y Proveedores de Servicios
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Salones, sonido, catering y seguridad contratados en San Martín de los Andes.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Proveedor / Servicio</th>
                <th style={{ padding: '0.85rem 1rem' }}>Evento Asociado</th>
                <th style={{ padding: '0.85rem 1rem' }}>Fecha Evento</th>
                <th style={{ padding: '0.85rem 1rem' }}>Contacto en SMA</th>
                <th style={{ padding: '0.85rem 1rem' }}>Monto Contrato</th>
                <th style={{ padding: '0.85rem 1rem' }}>Estado</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order, idx) => {
                const parentEvt = events.find(e => e.id === order.eventId);
                return (
                  <tr key={`${order.eventId}-${order.id || idx}`} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.95rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          background: 'var(--primary-subtle)',
                          color: 'var(--primary-accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}>
                          {order.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{order.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{order.serviceType}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.95rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {order.eventTitle}
                    </td>
                    <td style={{ padding: '0.95rem 1rem', color: 'var(--text-secondary)' }}>
                      {formatDateSpanish(order.eventDate)}
                    </td>
                    <td style={{ padding: '0.95rem 1rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.78rem' }}>
                        {order.contactPerson && <span>👤 {order.contactPerson}</span>}
                        {order.phone && <span>📞 {order.phone}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '0.95rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatCurrency(order.cost)}
                    </td>
                    <td style={{ padding: '0.95rem 1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: order.confirmed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(249, 95, 53, 0.12)',
                        color: order.confirmed ? '#10b981' : 'var(--primary-accent)'
                      }}>
                        {order.confirmed ? 'Confirmado' : 'Pendiente'}
                      </span>
                    </td>
                    <td style={{ padding: '0.95rem 1rem', textAlign: 'right' }}>
                      {parentEvt && (
                        <button
                          onClick={() => onSelectEvent(parentEvt)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          Ver Evento <ExternalLink size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
