import type { EventItem } from '../types/event';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-sma-001',
    title: 'Fiesta de Egresados 2026 - CPEM N° 13 (Turno Mañana y Tarde)',
    category: 'egresados',
    status: 'confirmado',
    date: '2026-11-21',
    startTime: '21:30',
    endTime: '06:00',
    venueName: 'Salón de Eventos Le Village & Jardines',
    venueAddress: 'Gral. Roca 816, San Martín de los Andes, Neuquén',
    geoCoordinates: 'Gral. Roca 816, San Martín de los Andes, Neuquén',
    clientName: 'Comisión de Familias y Egresados (CPEM 13 - Mariana Ríos)',
    clientPhone: '+54 9 2972 42-8819',
    clientEmail: 'egresados.cpem13.sma@gmail.com',
    expectedGuests: 280,
    totalBudget: 14500000,
    organizerInCharge: 'Nico Rossi (Productor General)',
    bannerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    notes: 'Exigencia de habilitación municipal de SMA y ambulancia fija en puerta por ordenanza de nocturnidad.',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-10-25T14:30:00Z',
    payments: [
      {
        id: 'pay-1',
        concept: 'Seña inicial reserva de fecha salón y técnica (35%)',
        amount: 5075000,
        date: '2026-03-15',
        method: 'transferencia',
        reference: 'BCO-PROV-NEUQUEN-88190',
        notes: 'Acreditado en cuenta corriente BPN.'
      },
      {
        id: 'pay-2',
        concept: 'Segunda cuota catering y barra de mocktails (35%)',
        amount: 5075000,
        date: '2026-07-22',
        method: 'transferencia',
        reference: 'TRF-BPN-990142',
        notes: 'Verificado con tesorería de padres.'
      }
    ],
    expenses: [
      {
        id: 'exp-1',
        concept: 'Alquiler exclusivo salón Le Village y calefacción central',
        category: 'salon',
        amount: 4500000,
        paid: true,
        dueDate: '2026-03-15'
      },
      {
        id: 'exp-2',
        concept: 'Catering patagónico y barra de tragos sin alcohol',
        category: 'catering',
        amount: 3200000,
        paid: true,
        dueDate: '2026-08-01'
      },
      {
        id: 'exp-3',
        concept: 'Sonido line array cordillerano, pantallas LED y efectos criogénicos',
        category: 'tecnica_dj',
        amount: 2400000,
        paid: false,
        dueDate: '2026-11-10'
      },
      {
        id: 'exp-4',
        concept: 'Seguridad privada habilitada SMA y servicio médico de emergencia',
        category: 'seguridad',
        amount: 850000,
        paid: false,
        dueDate: '2026-11-15'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        time: '18:00',
        title: 'Prueba de sonido, láseres y calibración de pantallas',
        responsible: 'Técnica Cordillera Audio',
        status: 'completado',
        description: 'Chequeo de sonido envolvente y micrófonos inalámbricos.'
      },
      {
        id: 'tl-2',
        time: '21:00',
        title: 'Recepción en el deck exterior & Fotocabina 360',
        responsible: 'Equipo de Recepción & Logística',
        status: 'pendiente',
        description: 'Control de accesos y entrega de pulseras inviolables identificatorias.'
      },
      {
        id: 'tl-3',
        time: '22:15',
        title: 'Cena de egresados y familiares (Goumet patagónico)',
        responsible: 'Catering San Martín',
        status: 'pendiente'
      },
      {
        id: 'tl-4',
        time: '00:00',
        title: 'Entrada oficial de la camada con bengalas frías y video de despedida',
        responsible: 'Coordinador Nico + DJ',
        status: 'pendiente',
        description: 'Proyección del emotivo anuario escolar producido en el Lago Lácar.'
      },
      {
        id: 'tl-5',
        time: '01:30',
        title: 'Banda en vivo sorpresa y cotillón temático de montaña',
        responsible: 'Stage Manager',
        status: 'pendiente'
      },
      {
        id: 'tl-6',
        time: '04:30',
        title: 'Desayuno montañés con medialunas artesanales y chocolate caliente',
        responsible: 'Catering',
        status: 'pendiente'
      },
      {
        id: 'tl-7',
        time: '06:00',
        title: 'Cierre de la noche y retiro coordinado con transporte local',
        responsible: 'Seguridad & Coordinación',
        status: 'pendiente'
      }
    ],
    suppliers: [
      {
        id: 'sup-1',
        serviceType: 'Sonido Line Array, DJ & Luces Robotizadas',
        name: 'Patagonia Sound & Stage',
        contactPerson: 'Alejo Benítez',
        phone: '+54 9 2972 41-1122',
        email: 'patagonia.sound@sma.com.ar',
        cost: 2400000,
        confirmed: true,
        notes: 'Montaje de cabina espejada con máquinas de humo bajo.'
      },
      {
        id: 'sup-2',
        serviceType: 'Gastronomía y Barra Libre',
        name: 'Catering Cordillera Gourmet',
        contactPerson: 'Carla Méndez',
        phone: '+54 9 2972 49-3388',
        email: 'contacto@cordilleragourmet.com',
        cost: 3200000,
        confirmed: true,
        notes: 'Incluye opción vegetariana y celíaca verificada.'
      },
      {
        id: 'sup-3',
        serviceType: 'Fotografía, Drone sobre Lago Lácar y Video',
        name: 'Andes Motion Audiovisual',
        contactPerson: 'Lucas Varela',
        phone: '+54 9 2972 45-9922',
        cost: 950000,
        confirmed: true,
        notes: 'Entrega del reel aftermovie en 4K dentro de las 72 hs post-evento.'
      }
    ],
    tasks: [
      {
        id: 'tsk-1',
        title: 'Habilitación municipal nocturna en Secretaría de Gobierno SMA',
        assignedTo: 'Nico Rossi',
        dueDate: '2026-11-05',
        completed: true,
        priority: 'urgente'
      },
      {
        id: 'tsk-2',
        title: 'Confirmar cobertura médica con ambulancia de área protegida SMA',
        assignedTo: 'Valeria Castro',
        dueDate: '2026-11-12',
        completed: true,
        priority: 'alta'
      },
      {
        id: 'tsk-3',
        title: 'Revisión final de listas de accesos con los delegados del CPEM 13',
        assignedTo: 'Nico Rossi',
        dueDate: '2026-11-16',
        completed: false,
        priority: 'media'
      }
    ],
    guests: [
      {
        id: 'gst-1',
        fullName: 'Mateo Fernández (Egresado CPEM 13)',
        category: 'titular',
        tableOrZone: 'Mesa 1 - Principal',
        checkedIn: false,
        dniOrPass: '46.120.334'
      },
      {
        id: 'gst-2',
        fullName: 'Sofía Álvarez (Egresada CPEM 13)',
        category: 'titular',
        tableOrZone: 'Mesa 2 - Principal',
        checkedIn: false,
        dniOrPass: '46.882.112'
      },
      {
        id: 'gst-3',
        fullName: 'Mariana Ríos (Presidenta Comisión Padres)',
        category: 'vip',
        tableOrZone: 'Mesa Directiva',
        checkedIn: false,
        dietaryRestrictions: 'Celíaca (Menú sin TACC)',
        dniOrPass: '24.901.442'
      }
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Contrato_Locacion_LeVillage_SMA.pdf',
        size: 2450000,
        type: 'application/pdf',
        uploadedAt: '2026-03-15T12:00:00Z',
        category: 'contrato'
      },
      {
        id: 'att-2',
        name: 'Plano_Distribucion_Salon_Pista_SMA.png',
        size: 1820000,
        type: 'image/png',
        uploadedAt: '2026-09-10T16:20:00Z',
        category: 'plano'
      }
    ]
  },
  {
    id: 'evt-sma-002',
    title: 'Boda Mía & Facundo (Al pie del Cerro Chapelco)',
    category: 'boda',
    status: 'confirmado',
    date: '2026-11-28',
    startTime: '16:30',
    endTime: '04:00',
    venueName: 'Loi Suites Chapelco Hotel & Golf',
    venueAddress: 'Ruta Nacional 40 Km 2227, San Martín de los Andes, Neuquén',
    geoCoordinates: 'Loi Suites Chapelco, San Martín de los Andes, Neuquén',
    clientName: 'Facundo Martínez & Mía Roldán',
    clientPhone: '+54 9 2972 43-1990',
    clientEmail: 'boda.miafacu.chapelco@gmail.com',
    expectedGuests: 190,
    totalBudget: 18200000,
    organizerInCharge: 'Nico Rossi (Productor General)',
    bannerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    notes: 'Ceremonia al aire libre con vista a la cordillera. Carpa beduina calefaccionada prevista como Plan B.',
    createdAt: '2026-01-20T15:00:00Z',
    updatedAt: '2026-10-22T19:00:00Z',
    payments: [
      {
        id: 'pay-201',
        concept: 'Reserva exclusiva salón Loi Suites y deck exterior (50%)',
        amount: 9100000,
        date: '2026-01-25',
        method: 'transferencia',
        reference: 'TRF-BBVA-332190'
      }
    ],
    expenses: [
      {
        id: 'exp-201',
        concept: 'Locación Loi Suites + Suite nupcial vista a los cerros',
        category: 'salon',
        amount: 6200000,
        paid: true
      }
    ],
    timeline: [
      {
        id: 'tl-201',
        time: '16:30',
        title: 'Ceremonia en el parque con vista a Chapelco',
        responsible: 'Oficiante & Nico Rossi',
        status: 'pendiente'
      },
      {
        id: 'tl-202',
        time: '18:00',
        title: 'Atardecer cordillerano con degustación de vinos patagónicos',
        responsible: 'Sommelier & Catering',
        status: 'pendiente'
      }
    ],
    suppliers: [],
    tasks: [],
    guests: [],
    attachments: []
  },
  {
    id: 'evt-sma-003',
    title: 'Mis 15 - Chiara Santoro (Fiesta Glow en Costanera)',
    category: 'cumple15',
    status: 'confirmado',
    date: '2026-12-12',
    startTime: '21:00',
    endTime: '05:30',
    venueName: 'Espacio Lacar Eventos & Costanera',
    venueAddress: 'Av. Costanera y Cnel. Díaz, San Martín de los Andes, Neuquén',
    geoCoordinates: 'Costanera Lago Lacar, San Martín de los Andes, Neuquén',
    clientName: 'Familia Santoro (Marcelo Santoro)',
    clientPhone: '+54 9 2972 44-7722',
    clientEmail: 'santoro.eventos.sma@gmail.com',
    expectedGuests: 160,
    totalBudget: 11800000,
    organizerInCharge: 'Valeria Castro',
    bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    notes: 'Temática Neon Glow. Glitter bar con pigmentos biodegradables aprobados por Parque Nacional Lanín.',
    createdAt: '2026-04-05T12:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z',
    payments: [
      {
        id: 'pay-301',
        concept: 'Seña confirmación 40%',
        amount: 4720000,
        date: '2026-04-10',
        method: 'transferencia'
      }
    ],
    expenses: [],
    timeline: [],
    suppliers: [],
    tasks: [],
    guests: [],
    attachments: []
  },
  {
    id: 'evt-sma-004',
    title: 'Fiesta de Egresados 2026 - Escuela de Música SMA & San Juan Bosco',
    category: 'egresados',
    status: 'prospecto',
    date: '2026-12-19',
    startTime: '22:00',
    endTime: '06:00',
    venueName: 'Hostería y Complejo La Choza de los Andes',
    venueAddress: 'Calfulcurá 250, San Martín de los Andes, Neuquén',
    geoCoordinates: 'Calfulcura 250, San Martin de los Andes, Neuquen',
    clientName: 'Comisión Coordinadora Egresados Bosco & Música',
    clientPhone: '+54 9 2972 46-1029',
    clientEmail: 'egresados.sma26@gmail.com',
    expectedGuests: 230,
    totalBudget: 13200000,
    organizerInCharge: 'Nico Rossi (Productor General)',
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    notes: 'Presupuesto preliminar con menú patagónico y show de DJ local.',
    createdAt: '2026-09-01T14:00:00Z',
    updatedAt: '2026-10-24T18:00:00Z',
    payments: [],
    expenses: [],
    timeline: [],
    suppliers: [],
    tasks: [],
    guests: [],
    attachments: []
  }
];
