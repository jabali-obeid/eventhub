import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  Building2,
  Users,
  Plus
} from 'lucide-react';
import type { EventItem } from '../types/event';
import { formatCurrency, formatDateSpanish } from '../utils/formatters';
import { TENANT_CONFIG } from '../config/tenantConfig';

interface DashboardViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onCreateEvent: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  onSelectEvent,
  onCreateEvent
}) => {
  const confirmedEvents = events.filter(e => e.status === 'confirmado' || e.status === 'en_curso');
  
  const totalBudget = confirmedEvents.reduce((acc, curr) => acc + curr.totalBudget, 0);
  const totalCollected = confirmedEvents.reduce((acc, curr) => {
    return acc + curr.payments.reduce((pAcc, p) => pAcc + p.amount, 0);
  }, 0);
  const totalPending = totalBudget - totalCollected;

  const totalExpenses = confirmedEvents.reduce((acc, curr) => {
    return acc + curr.expenses.reduce((eAcc, e) => eAcc + e.amount, 0);
  }, 0);

  const netProfit = totalBudget - totalExpenses;
  const totalGuests = confirmedEvents.reduce((acc, curr) => acc + curr.expectedGuests, 0);

  // Próximos eventos ordenados
  const upcomingEvents = [...events]
    .filter(e => e.status !== 'finalizado' && e.status !== 'cancelado')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Saludo con estilo Finexy */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
            Buen día, {TENANT_CONFIG.producer.name.split(' ')[0]}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
            Monitoreá tus eventos en {TENANT_CONFIG.company.tagline}, ingresos por cuotas y contratos de {TENANT_CONFIG.company.name}.
          </p>
        </div>

        <button
          onClick={onCreateEvent}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.7rem 1.4rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-accent)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.88rem',
            boxShadow: '0 4px 14px rgba(249, 95, 53, 0.35)'
          }}
        >
          <Plus size={16} /> Crear Evento
        </button>
      </div>

      {/* Grid Superior Exacto al Diseño Finexy (3 Columnas Principales) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
        alignItems: 'stretch'
      }}>
        {/* Columna 1: Tarjeta Total Balance con botones Transfer/Request y Wallets */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-2xl)',
          padding: '1.65rem',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Presupuesto Total Contratado
              </span>
              <span style={{
                background: 'var(--bg-subtle)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--text-secondary)'
              }}>
                🇦🇷 ARS
              </span>
            </div>

            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem', letterSpacing: '-0.025em' }}>
              {formatCurrency(totalBudget)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem', color: '#10b981', fontSize: '0.78rem', fontWeight: 700 }}>
              <TrendingUp size={14} /> +12% respecto al mes anterior en SMA
            </div>

            {/* Botones Transfer / Request en píldoras estilo Finexy */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.35rem' }}>
              <button
                onClick={onCreateEvent}
                style={{
                  flex: 1,
                  background: '#14171f',
                  color: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <ArrowUpRight size={15} /> Asignar Cuotas
              </button>
              <button
                onClick={() => alert('CBU BPN: 0970001200001234567890')}
                style={{
                  flex: 1,
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-light)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <ArrowDownLeft size={15} /> Recibir BPN
              </button>
            </div>
          </div>

          {/* Sub-bloque: Desglose de Fondos por Salón / Tipo */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              Distribución de Fondos
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.65rem 0.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cobrado</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
                  {formatCurrency(totalCollected)}
                </div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.65rem 0.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gastos</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {formatCurrency(totalExpenses)}
                </div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.65rem 0.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Por Cobrar</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-accent)', marginTop: '0.2rem' }}>
                  {formatCurrency(totalPending)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2: 4 Tarjetas Cuadradas (Total Earnings Naranja, Spending, Income, Revenue) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Tarjeta Naranja Finexy Total Earnings */}
          <div style={{
            background: 'var(--primary-accent)',
            borderRadius: 'var(--radius-2xl)',
            padding: '1.5rem',
            color: '#ffffff',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.9 }}>Total Recaudado</span>
              <div style={{ background: 'rgba(255, 255, 255, 0.25)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={15} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {formatCurrency(totalCollected)}
              </div>
              <span style={{ fontSize: '0.74rem', opacity: 0.85, marginTop: '0.35rem', display: 'block' }}>
                ↑ 7% acreditado este mes
              </span>
            </div>
          </div>

          {/* Tarjeta Spending Blanca */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-2xl)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gastos SMA</span>
              <div style={{ background: 'var(--bg-subtle)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={15} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {formatCurrency(totalExpenses)}
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                Salones, sonido y catering
              </span>
            </div>
          </div>

          {/* Tarjeta Margen Neto Blanca */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-2xl)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Margen Neto</span>
              <div style={{ background: 'var(--bg-subtle)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={15} color="#10b981" />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10b981', letterSpacing: '-0.02em' }}>
                {formatCurrency(netProfit)}
              </div>
              <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600, marginTop: '0.35rem', display: 'block' }}>
                ↑ {totalBudget > 0 ? ((netProfit / totalBudget) * 100).toFixed(0) : 0}% rentabilidad
              </span>
            </div>
          </div>

          {/* Tarjeta Asistentes Blanca */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-2xl)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Asistentes SMA</span>
              <div style={{ background: 'var(--bg-subtle)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={15} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {totalGuests}
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                Egresados y familias
              </span>
            </div>
          </div>
        </div>

        {/* Columna 3: Gráfico / Barras de Progreso Mensual Estilo Finexy */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-2xl)',
          padding: '1.65rem',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Flujo de Ingresos & Cuotas
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Comparativa de recaudación por período
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.72rem', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-accent)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-accent)' }} /> Cobrado
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#14171f' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#14171f' }} /> Costos
                </span>
              </div>
            </div>

            {/* Barras verticales estilo el gráfico Finexy de la imagen */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', marginTop: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
              {[
                { month: 'Ene', cobrado: 45, costo: 25 },
                { month: 'Feb', cobrado: 60, costo: 35 },
                { month: 'Mar', cobrado: 75, costo: 40 },
                { month: 'Abr', cobrado: 50, costo: 30 },
                { month: 'May', cobrado: 85, costo: 45 },
                { month: 'Jun', cobrado: 95, costo: 55 },
                { month: 'Jul', cobrado: 70, costo: 38 },
                { month: 'Ago', cobrado: 60, costo: 30 }
              ].map((bar, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '16px', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                    {/* Barra naranja (Cobrado) */}
                    <div style={{
                      width: '100%',
                      height: `${bar.cobrado}px`,
                      background: 'var(--primary-accent)',
                      borderRadius: '4px'
                    }} />
                    {/* Barra negra (Costos) */}
                    <div style={{
                      width: '100%',
                      height: `${bar.costo}px`,
                      background: '#14171f',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Capacidad promedio cubierta:
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              94.8% en salones de SMA
            </span>
          </div>
        </div>
      </div>

      {/* Grid Inferior: Tarjeta Cuenta BPN y Tabla de Actividades Recientes Estilo Finexy */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 340px) 1fr',
        gap: '1.25rem'
      }}>
        {/* Tarjetas Virtuales & Alias de la Organización estilo Finexy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-2xl)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>
                  Tarjetas Virtuales & Alias
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Cobros y pagos de la organización
                </span>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--primary-accent)',
                background: 'var(--primary-subtle)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)'
              }}>
                SMA Activas
              </span>
            </div>

            {/* Tarjetas Virtuales dinámicas leídas de TENANT_CONFIG */}
            {TENANT_CONFIG.virtualCards.map((card) => (
              <div 
                key={card.id}
                style={{
                  background: card.gradient,
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem',
                  color: '#ffffff',
                  marginBottom: '0.85rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.22)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CreditCard size={15} color="#ffffff" />
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.04em' }}>{card.title}</span>
                  </div>
                  <span style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700 }}>
                    {card.badge}
                  </span>
                </div>

                {/* Alias destacado con botón copiar */}
                <div style={{ marginTop: '0.8rem', marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.65rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ALIAS DE TRANSFERENCIA:
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(card.alias);
                        alert(`¡Alias ${card.alias} copiado al portapapeles!`);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Copiar Alias"
                    >
                      Copiar
                    </button>
                  </div>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {card.alias}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '0.5rem' }}>
                  <span>{card.accountType}: {card.cbuOrCvu}</span>
                  <span>{card.holder}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla de Actividades Recientes / Próximos Eventos Estilo Finexy */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-2xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Actividades y Eventos Próximos
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Operaciones activas en San Martín de los Andes
              </p>
            </div>
            <button
              onClick={() => {}}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary-accent)'
              }}
            >
              Ver Todos ({events.length})
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Evento / Colegio</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Lugar (SMA)</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Presupuesto</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Estado</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '0.85rem 0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: 'var(--primary-subtle)',
                          color: 'var(--primary-accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}>
                          {evt.title.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{evt.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{evt.clientName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 0.85rem', color: 'var(--text-secondary)' }}>
                      {evt.venueName}
                    </td>
                    <td style={{ padding: '0.85rem 0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatCurrency(evt.totalBudget)}
                    </td>
                    <td style={{ padding: '0.85rem 0.85rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: evt.status === 'confirmado' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(249, 95, 53, 0.12)',
                        color: evt.status === 'confirmado' ? '#10b981' : 'var(--primary-accent)'
                      }}>
                        {evt.status === 'confirmado' ? 'Confirmado' : 'En Gestión'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.85rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {formatDateSpanish(evt.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
