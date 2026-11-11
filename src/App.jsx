import React, { useState, useEffect } from 'react'
import PrivateArea from './components/PrivateArea'
import Register from './components/Register'
import Login from './components/Login'
import {
  LayoutGrid,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Info,
  Lock,
  Unlock
} from 'lucide-react'

// Helper to retrieve session synchronously on initial mount (guarantees NO FOUC)
const getStoredSession = () => {
  try {
    const raw = localStorage.getItem('personal_session')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.isAuthenticated && parsed.user) {
      return parsed.user
    }
  } catch (err) {
    console.error('Error al leer sesión de localStorage:', err)
  }
  return null
}

export default function App() {
  // Synchronous state initialization from localStorage
  const [currentUser, setCurrentUser] = useState(getStoredSession)
  const [currentView, setCurrentView] = useState(() => (getStoredSession() ? 'private' : 'login'))
  const [loginPrefill, setLoginPrefill] = useState(null)
  const [toast, setToast] = useState(null)

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3400)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Navigation Guard
  const navigateTo = (targetView) => {
    // 1. Protection rule: Private Area requires active authentication
    if (targetView === 'private') {
      const activeUser = currentUser || getStoredSession()
      if (!activeUser) {
        setToast({
          title: 'Acceso restringido',
          message: 'Iniciá sesión para acceder a tu Área Privada.',
          type: 'warning'
        })
        setCurrentView('login')
        return
      }
    }

    // 2. Clear prefill when manually leaving login
    if (targetView !== 'login') {
      setLoginPrefill(null)
    }

    setCurrentView(targetView)
  }

  // Handle successful login
  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    setLoginPrefill(null)
    setCurrentView('private')
    const firstName = user?.fullName ? user.fullName.trim().split(' ')[0] : 'Usuario'
    setToast({
      title: `¡Hola, ${firstName}!`,
      message: 'Bienvenido nuevamente a tu espacio personal.',
      type: 'success'
    })
  }

  // Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('personal_session')
    } catch (err) {
      console.error('Error al remover sesión:', err)
    }

    setCurrentUser(null)
    setLoginPrefill(null)
    setCurrentView('login')
    setToast({
      title: 'Sesión finalizada',
      message: 'Sesión cerrada correctamente.',
      type: 'info'
    })
  }

  // Handle transition from Register to Login
  const handleRegisterSuccessToLogin = (email) => {
    if (typeof email === 'string' && email.trim()) {
      setLoginPrefill({
        email: email.trim(),
        message: 'Cuenta creada exitosamente. Iniciá sesión con tus credenciales.'
      })
    } else {
      setLoginPrefill(null)
    }
    setCurrentView('login')
  }

  // Effect guard: ensure unauthorized views are redirected cleanly without render-time side effects
  useEffect(() => {
    if (currentView === 'private' && !currentUser) {
      setCurrentView('login')
    }
  }, [currentView, currentUser])

  return (
    <div className="app-container">
      {/* Background ambient lighting */}
      <div className="ambient-glow" aria-hidden="true" />

      {/* Floating View Switcher (macOS Segment Control) */}
      <aside className="view-switcher-floating" aria-label="Control de navegación de la aplicación">
        <div className="view-switcher-inner">
          <button
            type="button"
            className={`view-pill-btn ${currentView === 'login' ? 'active' : ''}`}
            onClick={() => navigateTo('login')}
            title="Pantalla de Inicio de sesión"
          >
            <LogIn size={13} strokeWidth={2.2} />
            <span>Login</span>
          </button>

          <button
            type="button"
            className={`view-pill-btn ${currentView === 'register' ? 'active' : ''}`}
            onClick={() => navigateTo('register')}
            title="Pantalla de Registro"
          >
            <UserPlus size={13} strokeWidth={2.2} />
            <span>Registro</span>
          </button>

          <button
            type="button"
            className={`view-pill-btn ${currentView === 'private' ? 'active' : ''}`}
            onClick={() => navigateTo('private')}
            title={currentUser ? `Área Privada (${currentUser.fullName})` : 'Área Privada (Requiere sesión)'}
          >
            {currentUser ? (
              <Unlock size={12} strokeWidth={2.2} color="#34C759" />
            ) : (
              <Lock size={12} strokeWidth={2.2} color="var(--color-muted)" />
            )}
            <span>Área Privada</span>
          </button>
        </div>
      </aside>

      {/* View 1: Protected Private Area */}
      {currentView === 'private' && currentUser && (
        <PrivateArea
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateToRegister={() => navigateTo('register')}
          onShowToast={setToast}
        />
      )}

      {/* View 2: Registration Screen */}
      {currentView === 'register' && (
        <Register
          onNavigateToLogin={(email) => handleRegisterSuccessToLogin(email)}
          onNavigateToPrivateArea={() => navigateTo('private')}
        />
      )}

      {/* View 3: Login Screen */}
      {currentView === 'login' && (
        <Login
          prefillEmail={loginPrefill?.email}
          infoMessage={loginPrefill?.message}
          onNavigateToRegister={() => navigateTo('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Global Minimalist Toast Notification */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="global-app-toast"
        >
          {toast.type === 'success' && <CheckCircle2 size={18} color="#34C759" strokeWidth={2.2} style={{ flexShrink: 0 }} />}
          {toast.type === 'warning' && <AlertCircle size={18} color="#FF9500" strokeWidth={2.2} style={{ flexShrink: 0 }} />}
          {toast.type === 'info' && <Info size={18} color="#0071E3" strokeWidth={2.2} style={{ flexShrink: 0 }} />}

          <div>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        </aside>
      )}
    </div>
  )
}
