// Storage Service - Centralized localStorage simulation for PERSONAL & PERSONAL ENTERPRISES

const STORAGE_KEYS = {
  USERS: 'personal_users',
  SESSION: 'personal_session',
  DOCS: 'personal_enterprise_docs',
  LOGS: 'personal_enterprise_logs',
  SEEDED: 'personal_enterprise_seeded_v1'
}

// Initial seed data as required by specification
const SEED_USERS = [
  {
    id: 'usr_admin',
    fullName: 'Administrador Nexora',
    email: 'admin@nexora.demo',
    password: 'NexoraAdmin2026!',
    role: 'enterprise_admin',
    company: 'NEXORA',
    status: 'authorized',
    createdAt: '2026-10-01T10:00:00.000Z'
  },
  {
    id: 'usr_lucas',
    fullName: 'Lucas Martínez',
    email: 'lucas@nexora.demo',
    password: 'Lucas2026!',
    role: 'enterprise_employee',
    company: 'NEXORA',
    status: 'authorized',
    createdAt: '2026-10-15T14:30:00.000Z'
  },
  {
    id: 'usr_sofia',
    fullName: 'Sofía Rossi',
    email: 'sofia@nexora.demo',
    password: 'Sofia2026!',
    role: 'enterprise_employee',
    company: 'NEXORA',
    status: 'authorized',
    createdAt: '2026-10-20T09:15:00.000Z'
  },
  {
    id: 'usr_martin',
    fullName: 'Martín Gómez',
    email: 'martin@nexora.demo',
    password: 'Martin2026!',
    role: 'enterprise_employee',
    company: 'NEXORA',
    status: 'pending', // No autorizado inicialmente
    createdAt: '2026-11-01T16:45:00.000Z'
  }
]

const SEED_DOCS = [
  {
    id: 'doc_1',
    title: 'Plan Estratégico NEXORA 2026-2027',
    category: 'Estrategia',
    classification: 'Confidencial',
    version: 'v2.4',
    updatedAt: '2026-11-02',
    author: 'Dirección Ejecutiva',
    size: '4.2 MB',
    summary: 'Lineamientos de crecimiento, presupuesto operativo y proyección de nuevas divisiones de negocio.'
  },
  {
    id: 'doc_2',
    title: 'Protocolo de Seguridad y Gestión de Accesos RBAC',
    category: 'Seguridad',
    classification: 'Uso Interno',
    version: 'v4.1',
    updatedAt: '2026-10-28',
    author: 'Ciberseguridad & DevOps',
    size: '1.8 MB',
    summary: 'Normativas de autenticación de dos factores, revocación de credenciales y auditoría de terminales.'
  },
  {
    id: 'doc_3',
    title: 'Arquitectura de Datos y Microservicios Cloud',
    category: 'Ingeniería',
    classification: 'Confidencial',
    version: 'v3.0',
    updatedAt: '2026-10-14',
    author: 'Arquitectura de Software',
    size: '6.5 MB',
    summary: 'Diagramas de flujo, diseño de API Gateway y redundancia de datos multirregión.'
  },
  {
    id: 'doc_4',
    title: 'Manual de Políticas de Empleados y Beneficios',
    category: 'Recursos Humanos',
    classification: 'Público Interno',
    version: 'v1.9',
    updatedAt: '2026-09-30',
    author: 'People & Culture',
    size: '2.1 MB',
    summary: 'Guía de trabajo híbrido, licencias, coberturas médicas internacionales y desarrollo profesional.'
  }
]

const SEED_LOGS = [
  {
    id: 'log_1',
    action: 'AUTORIZACION_CONCEDIDA',
    details: 'Autorización concedida a Sofía Rossi (sofia@nexora.demo)',
    actor: 'admin@nexora.demo',
    timestamp: '2026-10-20T09:20:00.000Z'
  },
  {
    id: 'log_2',
    action: 'AUTORIZACION_CONCEDIDA',
    details: 'Autorización concedida a Lucas Martínez (lucas@nexora.demo)',
    actor: 'admin@nexora.demo',
    timestamp: '2026-10-15T14:35:00.000Z'
  },
  {
    id: 'log_3',
    action: 'REGISTRO_EMPLEADO',
    details: 'Nuevo registro empresarial: Martín Gómez (martin@nexora.demo). Estado: Pendiente de autorización.',
    actor: 'martin@nexora.demo',
    timestamp: '2026-11-01T16:45:00.000Z'
  }
]

// Initialize seed data if not present
export const initializeStorage = () => {
  try {
    const isSeeded = localStorage.getItem(STORAGE_KEYS.SEEDED)
    const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')

    if (!isSeeded || existingUsers.length === 0) {
      // Merge keeping any user that was previously created
      const mergedUsers = [...SEED_USERS]
      existingUsers.forEach((u) => {
        if (!mergedUsers.some((s) => s.email.toLowerCase() === u.email.toLowerCase())) {
          mergedUsers.push(u)
        }
      })
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mergedUsers))
      localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(SEED_DOCS))
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(SEED_LOGS))
      localStorage.setItem(STORAGE_KEYS.SEEDED, 'true')
    } else {
      // Ensure seed accounts exist even if user had older localStorage
      let updated = false
      SEED_USERS.forEach((seedUser) => {
        if (!existingUsers.some((u) => u.email.toLowerCase() === seedUser.email.toLowerCase())) {
          existingUsers.push(seedUser)
          updated = true
        }
      })
      if (updated) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(existingUsers))
      }
      if (!localStorage.getItem(STORAGE_KEYS.DOCS)) {
        localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(SEED_DOCS))
      }
      if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(SEED_LOGS))
      }
    }
  } catch (err) {
    console.error('Error al inicializar almacenamiento:', err)
  }
}

// User methods
export const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
  } catch {
    return []
  }
}

export const saveUser = (user) => {
  const users = getStoredUsers()
  users.push(user)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export const findUserByEmail = (email) => {
  if (!email) return null
  const cleanEmail = email.trim().toLowerCase()
  const users = getStoredUsers()
  return users.find((u) => u.email && u.email.toLowerCase() === cleanEmail) || null
}

export const updateEmployeeStatus = (userId, newStatus, adminActor = 'admin@nexora.demo') => {
  const users = getStoredUsers()
  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return null

  const targetUser = users[userIndex]
  targetUser.status = newStatus
  users[userIndex] = targetUser
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

  // If the currently active session is this user, update active session too
  const activeSession = getActiveSession()
  if (activeSession && activeSession.user && activeSession.user.id === userId) {
    activeSession.user.status = newStatus
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(activeSession))
  }

  // Record audit log
  addAuditLog(
    newStatus === 'authorized' ? 'AUTORIZACION_CONCEDIDA' : 'AUTORIZACION_REVOCADA',
    `${newStatus === 'authorized' ? 'Permiso concedido' : 'Permiso revocado'} para ${targetUser.fullName} (${targetUser.email})`,
    adminActor
  )

  return targetUser
}

// Session methods
export const getActiveSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.isAuthenticated && parsed.user) {
      // Re-fetch user status from latest stored users to guarantee live permission checks
      const freshUser = findUserByEmail(parsed.user.email)
      if (freshUser) {
        parsed.user.status = freshUser.status
        parsed.user.role = freshUser.role
      }
      return parsed
    }
  } catch (err) {
    console.error('Error al leer sesión:', err)
  }
  return null
}

export const setActiveSession = (user) => {
  const sessionData = {
    isAuthenticated: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role || 'personal_user',
      status: user.status || 'authorized',
      company: user.company || null
    },
    loggedAt: new Date().toISOString()
  }
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData))
  return sessionData
}

export const clearActiveSession = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION)
}

// Enterprise Docs & Logs methods
export const getEnterpriseDocs = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCS) || '[]')
  } catch {
    return SEED_DOCS
  }
}

export const getAuditLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]')
  } catch {
    return SEED_LOGS
  }
}

export const addAuditLog = (action, details, actor) => {
  const logs = getAuditLogs()
  const newLog = {
    id: `log_${Date.now()}`,
    action,
    details,
    actor: actor || 'Sistema',
    timestamp: new Date().toISOString()
  }
  logs.unshift(newLog)
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs))
  return newLog
}

