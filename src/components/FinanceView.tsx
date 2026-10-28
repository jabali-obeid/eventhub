import React from 'react';
import { 
  ArrowDownLeft
} from 'lucide-react';
import type { EventItem, PaymentRecord } from '../types/event';
import { formatCurrency, formatDateSpanish } from '../utils/formatters';
import { TENANT_CONFIG } from '../config/tenantConfig';

interface FinanceViewProps {
  events: EventItem[];
  onSelectEvent?: (event: EventItem) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ events }) => {
  // Consolidar todos los cobros / pagos registrados en los eventos
  const allPayments: Array<PaymentRecord & { eventTitle: string; eventId: string; clientName: string }> = [];
  events.forEach(e => {
    e.payments.forEach(p => {
      allPayments.push({
        ...p,
        eventTitle: e.title,
        eventId: e.id,
        clientName: e.clientName
      });
    });
  });

  // Ordenar pagos por fecha descendente
  allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPresupuestado = events.reduce((acc, curr) => acc + curr.totalBudget, 0);
  const totalCobrado = allPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPendiente = totalPresupuestado - totalCobrado;

  const totalGastos = events.reduce((acc, curr) => {
    return acc + curr.expenses.reduce((eAcc, e) => eAcc + e.amount, 0);
  }, 0);

  const saldoDisponibleBPN = totalCobrado - totalGastos;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Cuenta Corriente BPN */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Tarjeta Cuenta Corriente BPN con diseño tarjeta premium */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 'var(--radius-2xl)',
          padding: '1.75rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '220px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Logo BPN / Chip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7 }}>
                {TENANT_CONFIG.virtualCards[0]?.accountType || 'CUENTA BANCARIA'}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.2rem' }}>
                Cuenta Corriente {TENANT_CONFIG.company.name}
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              width: '40px',
              height: '30px',
              borderRadius: '6px',
              opacity: 0.9
            }} />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Saldo Operativo Disponible</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
              {formatCurrency(saldoDisponibleBPN)}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', opacity: 0.8 }}>
            <span>CBU: {TENANT_CONFIG.virtualCards[0]?.cbuOrCvu || '0970001200001234567890'}</span>
            <span>ALIAS: {TENANT_CONFIG.virtualCards[0]?.alias || 'EVENTUM.SMA.PRODUCCION'}</span>
          </div>
        </div>

        {/* Tarjeta Naranja Finexy Total Earnings */}
        <div style={{
          background: 'var(--primary-accent)',
          borderRadius: 'var(--radius-2xl)',
          padding: '1.75rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Total Recaudado (Cobros Ingresados)</span>
              <ArrowDownLeft size={20} />
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
              {formatCurrency(totalCobrado)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.2)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>Total Presupuestado</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem' }}>{formatCurrency(totalPresupuestado)}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.2)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>Saldo por Cobrar</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem' }}>{formatCurrency(totalPendiente)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Movimientos y Pagos estilo Finexy */}
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
              Movimientos & Cobros Recientes
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Acreditaciones por transferencia BPN, señas y cuotas de eventos en SMA.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Comprobante / Concepto</th>
                <th style={{ padding: '0.85rem 1rem' }}>Evento Asociado</th>
                <th style={{ padding: '0.85rem 1rem' }}>Cliente / Delegado</th>
                <th style={{ padding: '0.85rem 1rem' }}>Fecha</th>
                <th style={{ padding: '0.85rem 1rem' }}>Método</th>
                <th style={{ padding: '0.85rem 1rem' }}>Monto Acreditado</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {allPayments.map((payment, idx) => (
                <tr key={`${payment.eventId}-${payment.id || idx}`} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.95rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ArrowDownLeft size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{payment.concept}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>BPN Transf. Acreditada</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.95rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {payment.eventTitle}
                  </td>
                  <td style={{ padding: '0.95rem 1rem', color: 'var(--text-secondary)' }}>
                    {payment.clientName}
                  </td>
                  <td style={{ padding: '0.95rem 1rem', color: 'var(--text-secondary)' }}>
                    {formatDateSpanish(payment.date)}
                  </td>
                  <td style={{ padding: '0.95rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-subtle)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)'
                    }}>
                      {payment.method}
                    </span>
                  </td>
                  <td style={{ padding: '0.95rem 1rem', fontWeight: 800, color: '#10b981' }}>
                    +{formatCurrency(payment.amount)}
                  </td>
                  <td style={{ padding: '0.95rem 1rem', textAlign: 'right' }}>
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981'
                    }}>
                      Acreditado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
