import React, { useState, useEffect } from 'react'
import PersonalLanding from './components/personal/PersonalLanding'
import PersonalLogin from './components/personal/PersonalLogin'
import PersonalRegister from './components/personal/PersonalRegister'
import PersonalDashboard from './components/personal/PersonalDashboard'

import EnterpriseLanding from './components/enterprise/EnterpriseLanding'
import EnterpriseLogin from './components/enterprise/EnterpriseLogin'
import EnterpriseRegister from './components/enterprise/EnterpriseRegister'
import EnterpriseAdminDashboard from './components/enterprise/EnterpriseAdminDashboard'
import EnterpriseEmployeeDashboard from './components/enterprise/EnterpriseEmployeeDashboard'
import EnterpriseStatusView from './components/enterprise/EnterpriseStatusView'

import {
  initializeStorage,
  getActiveSession,
  setActiveSession,
  clearActiveSession,
  findUserByEmail
} from './services/storage'

import {
  CheckCircle2,
  AlertCircle,
  Info,
  Building2,
  User,
  ShieldCheck
} from 'lucide-react'

// Initialize seed data on load
initializeStorage()

export default function App() {
  // Determine initial view based on existing active session
  const determineInitialState = () => {
    const session = getActiveSession()
    if (!session || !session.user) {
      return { user: null, view: 'personal_landing' }
    }

    const { user } = session

    if (user.role === 'enterprise_admin') {
      return { user, view: 'enterprise_admin_dashboard' }
    }

    if (user.role === 'enterprise_employee') {
      if (user.status === 'authorized') {
        return { user, view: 'enterprise_employee_dashboard' }
      }
      if (user.status === 'pending') {
        return { user, view: 'enterprise_pending' }
      }
      if (user.status === 'revoked') {
        return { user, view: 'enterprise_revoked' }
      }
      return { user, view: 'enterprise_pending' }
    }

    // Default individual user
    return { user, view: 'personal_private' }
  }

  const [initial] = useState(determineInitialState)
  const [currentUser, setCurrentUser] = useState(initial.user)
  const [currentView, setCurrentView] = useState(initial.view)
  const [loginPrefill, setLoginPrefill] = useState(null)
  const [toast, setToast] = useState(null)

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3600)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Synchronize session permissions dynamically on view change
  useEffect(() => {
    if (currentUser && currentUser.email) {
      const freshUser = findUserByEmail(currentUser.email)
      if (freshUser) {
        if (freshUser.status !== currentUser.status || freshUser.role !== currentUser.role) {
          const updatedUser = { ...currentUser, status: freshUser.status, role: freshUser.role }
          setCurrentUser(updatedUser)
          setActiveSession(updatedUser)

          // If current user is on employee dashboard and was revoked, redirect immediately
          if (currentView === 'enterprise_employee_dashboard' && freshUser.status === 'revoked') {
            setCurrentView('enterprise_revoked')
          }
        }
      }
    }
  }, [currentView, currentUser])

  // Navigation Guard & Router
  const navigateTo = (targetView) => {
    // 1. Guard: Protected Personal Area
    if (targetView === 'personal_private') {
      const session = getActiveSession()
      if (!session || !session.user) {
        setToast({
          title: 'Acceso restringido',
          message: 'Iniciá sesión para acceder a tu Área Privada.',
          type: 'warning'
        })
        setCurrentView('personal_login')
        return
      }
    }

    // 2. Guard: Enterprise Admin Dashboard
    if (targetView === 'enterprise_admin_dashboard') {
      const session = getActiveSession()
      if (!session || !session.user || session.user.role !== 'enterprise_admin') {
        setToast({
          title: 'Acceso denegado',
          message: 'Se requieren credenciales de Administrador para acceder a este panel.',
          type: 'warning'
        })
        setCurrentView('enterprise_login')
        return
      }
    }

    // 3. Guard: Enterprise Employee Dashboard
    if (targetView === 'enterprise_employee_dashboard') {
      const session = getActiveSession()
      if (!session || !session.user) {
        setCurrentView('enterprise_login')
        return
      }
      if (session.user.role !== 'enterprise_employee' && session.user.role !== 'enterprise_admin') {
        setCurrentView('enterprise_denied')
        return
      }
      if (session.user.status === 'pending') {
        setCurrentView('enterprise_pending')
        return
      }
      if (session.user.status === 'revoked') {
        setCurrentView('enterprise_revoked')
        return
      }
    }

    setLoginPrefill(null)
    setCurrentView(targetView)
  }

  // Handle successful login in Personal
  const handlePersonalLoginSuccess = (user) => {
    const session = setActiveSession(user)
    setCurrentUser(session.user)
    setLoginPrefill(null)
    setCurrentView('personal_private')
    const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Usuario'
    setToast({
      title: `¡Hola, ${firstName}!`,
      message: 'Bienvenido nuevamente a tu espacio personal.',
      type: 'success'
    })
  }

  // Handle successful login in Enterprise
  const handleEnterpriseLoginSuccess = (user) => {
    const session = setActiveSession(user)
    setCurrentUser(session.user)
    setLoginPrefill(null)

    if (user.role === 'enterprise_admin') {
      setCurrentView('enterprise_admin_dashboard')
      setToast({
        title: 'Panel Administrador NEXORA',
        message: 'Sesión iniciada como Administrador Corporativo.',
        type: 'success'
      })
      return
    }

    if (user.role === 'enterprise_employee') {
      if (user.status === 'authorized') {
        setCurrentView('enterprise_employee_dashboard')
        setToast({
          title: `Bienvenido/a, ${user.fullName.split(' ')[0]}`,
          message: 'Acceso corporativo autorizado a NEXORA.',
          type: 'success'
        })
      } else if (user.status === 'pending') {
        setCurrentView('enterprise_pending')
      } else if (user.status === 'revoked') {
        setCurrentView('enterprise_revoked')
      }
    }
  }

  // Quick 1-click Demo Login from Enterprise Landing
  const handleQuickDemoLogin = (email, password) => {
    const userFound = findUserByEmail(email)
    if (userFound && userFound.password === password) {
      handleEnterpriseLoginSuccess(userFound)
    } else {
      setLoginPrefill({ email, message: 'Credenciales cargadas para inicio rápido.' })
      setCurrentView('enterprise_login')
    }
  }

  // Handle Logout
  const handleLogout = (isEnterprise = false) => {
    clearActiveSession()
    setCurrentUser(null)
    setLoginPrefill(null)

    if (isEnterprise || currentView.startsWith('enterprise_')) {
      setCurrentView('enterprise_login')
      setToast({
        title: 'Sesión corporativa cerrada',
        message: 'Sesión finalizada correctamente en NEXORA.',
        type: 'info'
      })
    } else {
      setCurrentView('personal_login')
      setToast({
        title: 'Sesión finalizada',
        message: 'Sesión cerrada correctamente.',
        type: 'info'
      })
    }
  }

  // Check status again for pending employees
  const handleCheckStatusAgain = () => {
    if (!currentUser) {
      setCurrentView('enterprise_login')
      return
    }
    const freshUser = findUserByEmail(currentUser.email)
    if (freshUser) {
      setCurrentUser(freshUser)
      setActiveSession(freshUser)
      if (freshUser.status === 'authorized') {
        setCurrentView('enterprise_employee_dashboard')
        setToast({
          title: '¡Acceso Concedido!',
          message: 'Tu cuenta ha sido aprobada por el administrador de NEXORA.',
          type: 'success'
        })
      } else if (freshUser.status === 'revoked') {
        setCurrentView('enterprise_revoked')
      } else {
        setToast({
          title: 'Aún pendiente',
          message: 'Tu solicitud sigue a la espera de autorización por el administrador.',
          type: 'info'
        })
      }
    }
  }

  const isEnterpriseView = currentView.startsWith('enterprise_')

  return (
    <div className={`root-app-container ${isEnterpriseView ? 'theme-enterprise-dark' : 'theme-personal-light'}`}>
      {/* Floating Environment Switcher (Top Right Bar) */}
      <aside className="global-environment-switcher" aria-label="Selector de entorno de la plataforma">
        <div className="env-switcher-inner">
          <button
            type="button"
            className={`env-pill-btn ${!isEnterpriseView ? 'active-personal' : ''}`}
            onClick={() => navigateTo(currentUser && currentUser.role === 'personal_user' ? 'personal_private' : 'personal_landing')}
            title="Ir a PERSONAL (Usuarios individuales)"
          >
            <User size={13} />
            <span>PERSONAL</span>
          </button>

          <button
            type="button"
            className={`env-pill-btn ${isEnterpriseView ? 'active-enterprise' : ''}`}
            onClick={() => {
              if (currentUser && currentUser.role === 'enterprise_admin') {
                navigateTo('enterprise_admin_dashboard')
              } else if (currentUser && currentUser.role === 'enterprise_employee' && currentUser.status === 'authorized') {
                navigateTo('enterprise_employee_dashboard')
              } else if (currentUser && currentUser.role === 'enterprise_employee' && currentUser.status === 'pending') {
                navigateTo('enterprise_pending')
              } else {
                navigateTo('enterprise_landing')
              }
            }}
            title="Ir a PERSONAL ENTERPRISES (Portal Corporativo NEXORA)"
          >
            <Building2 size={13} />
            <span>ENTERPRISES</span>
            <span className="env-tag-nexora">NEXORA</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* VIEW ROUTING                                             */}
      {/* ======================================================== */}

      {/* 1. PERSONAL - Landing Page */}
      {currentView === 'personal_landing' && (
        <PersonalLanding
          onNavigateToLogin={() => navigateTo('personal_login')}
          onNavigateToRegister={() => navigateTo('personal_register')}
          onNavigateToEnterprise={() => navigateTo('enterprise_landing')}
          currentUser={currentUser}
          onNavigateToPrivate={() => navigateTo('personal_private')}
        />
      )}

      {/* 2. PERSONAL - Login */}
      {currentView === 'personal_login' && (
        <PersonalLogin
          prefillEmail={loginPrefill?.email}
          infoMessage={loginPrefill?.message}
          onNavigateToRegister={() => navigateTo('personal_register')}
          onLoginSuccess={handlePersonalLoginSuccess}
          onNavigateToLanding={() => navigateTo('personal_landing')}
          onNavigateToEnterprise={() => navigateTo('enterprise_landing')}
        />
      )}

      {/* 3. PERSONAL - Register */}
      {currentView === 'personal_register' && (
        <PersonalRegister
          onNavigateToLogin={(email) => {
            if (typeof email === 'string' && email.trim()) {
              setLoginPrefill({
                email: email.trim(),
                message: 'Cuenta creada exitosamente. Iniciá sesión con tus credenciales.'
              })
            }
            navigateTo('personal_login')
          }}
          onNavigateToLanding={() => navigateTo('personal_landing')}
          onNavigateToEnterprise={() => navigateTo('enterprise_landing')}
        />
      )}

      {/* 4. PERSONAL - Private Dashboard */}
      {currentView === 'personal_private' && currentUser && (
        <PersonalDashboard
          currentUser={currentUser}
          onLogout={() => handleLogout(false)}
          onShowToast={setToast}
          onNavigateToEnterprise={() => navigateTo('enterprise_landing')}
        />
      )}

      {/* 5. ENTERPRISE - Landing Portal */}
      {currentView === 'enterprise_landing' && (
        <EnterpriseLanding
          onNavigateToEnterpriseLogin={() => navigateTo('enterprise_login')}
          onNavigateToEnterpriseRegister={() => navigateTo('enterprise_register')}
          onNavigateToPersonal={() => navigateTo('personal_landing')}
          onQuickDemoLogin={handleQuickDemoLogin}
        />
      )}

      {/* 6. ENTERPRISE - Login */}
      {currentView === 'enterprise_login' && (
        <EnterpriseLogin
          prefillEmail={loginPrefill?.email}
          infoMessage={loginPrefill?.message}
          onLoginSuccess={handleEnterpriseLoginSuccess}
          onNavigateToRegister={() => navigateTo('enterprise_register')}
          onNavigateToLanding={() => navigateTo('enterprise_landing')}
          onNavigateToPersonal={() => navigateTo('personal_landing')}
        />
      )}

      {/* 7. ENTERPRISE - Register (Employee registration) */}
      {currentView === 'enterprise_register' && (
        <EnterpriseRegister
          onNavigateToLogin={(email) => {
            if (typeof email === 'string' && email.trim()) {
              setLoginPrefill({
                email: email.trim(),
                message: 'Registro completado. Iniciá sesión para verificar tu autorización.'
              })
            }
            navigateTo('enterprise_login')
          }}
          onNavigateToLanding={() => navigateTo('enterprise_landing')}
          onNavigateToPersonal={() => navigateTo('personal_landing')}
        />
      )}

      {/* 8. ENTERPRISE - Admin Dashboard */}
      {currentView === 'enterprise_admin_dashboard' && currentUser && currentUser.role === 'enterprise_admin' && (
        <EnterpriseAdminDashboard
          currentUser={currentUser}
          onLogout={() => handleLogout(true)}
          onShowToast={setToast}
          onNavigateToPersonal={() => navigateTo('personal_landing')}
        />
      )}

      {/* 9. ENTERPRISE - Authorized Employee Dashboard */}
      {currentView === 'enterprise_employee_dashboard' && currentUser && currentUser.status === 'authorized' && (
        <EnterpriseEmployeeDashboard
          currentUser={currentUser}
          onLogout={() => handleLogout(true)}
          onShowToast={setToast}
          onNavigateToPersonal={() => navigateTo('personal_landing')}
        />
      )}

      {/* 10. ENTERPRISE - Status: Pending */}
      {currentView === 'enterprise_pending' && (
        <EnterpriseStatusView
          type="pending"
          currentUser={currentUser}
          onLogout={() => handleLogout(true)}
          onNavigateToPersonal={() => navigateTo('personal_landing')}
          onNavigateToEnterpriseLogin={() => navigateTo('enterprise_login')}
          onCheckStatusAgain={handleCheckStatusAgain}
        />
      )}

      {/* 11. ENTERPRISE - Status: Revoked */}
      {currentView === 'enterprise_revoked' && (
        <EnterpriseStatusView
          type="revoked"
          currentUser={currentUser}
          onLogout={() => handleLogout(true)}
          onNavigateToPersonal={() => navigateTo('personal_landing')}
          onNavigateToEnterpriseLogin={() => navigateTo('enterprise_login')}
        />
      )}

      {/* 12. ENTERPRISE - Status: Denied */}
      {currentView === 'enterprise_denied' && (
        <EnterpriseStatusView
          type="denied"
          currentUser={currentUser}
          onLogout={() => handleLogout(true)}
          onNavigateToPersonal={() => navigateTo('personal_landing')}
          onNavigateToEnterpriseLogin={() => navigateTo('enterprise_login')}
        />
      )}

      {/* Global Toast Notification */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className={`global-app-toast ${isEnterpriseView ? 'toast-enterprise' : 'toast-personal'}`}
        >
          {toast.type === 'success' && <CheckCircle2 size={18} color={isEnterpriseView ? '#06B6D4' : '#34C759'} strokeWidth={2.2} style={{ flexShrink: 0 }} />}
          {toast.type === 'warning' && <AlertCircle size={18} color="#FF9500" strokeWidth={2.2} style={{ flexShrink: 0 }} />}
          {toast.type === 'info' && <Info size={18} color={isEnterpriseView ? '#06B6D4' : '#0071E3'} strokeWidth={2.2} style={{ flexShrink: 0 }} />}

          <div>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        </aside>
      )}
    </div>
  )
}
