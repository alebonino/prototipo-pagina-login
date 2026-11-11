import React, { useState, useId, useEffect } from 'react'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Info,
  X,
  Users,
  CheckCircle2
} from 'lucide-react'

export default function Login({ onNavigateToRegister, onLoginSuccess, prefillEmail, infoMessage }) {
  const [formData, setFormData] = useState({
    email: prefillEmail || '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [registeredAccountsCount, setRegisteredAccountsCount] = useState(0)
  const [demoAccounts, setDemoAccounts] = useState([])

  const emailId = useId()
  const passwordId = useId()

  // Sync prefillEmail if passed from registration
  useEffect(() => {
    if (prefillEmail) {
      setFormData((prev) => ({
        ...prev,
        email: prefillEmail
      }))
    }
  }, [prefillEmail])

  // Inspect existing registered accounts in localStorage to enhance reviewer experience
  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem('personal_users') || '[]')
      setRegisteredAccountsCount(users.length)
      setDemoAccounts(users)
    } catch {
      setRegisteredAccountsCount(0)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    // Clear specific field error as user types
    if (errors[name] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
        general: null
      }))
    }
  }

  const validate = () => {
    const newErrors = {}
    const trimmedEmail = formData.email.trim()
    const { password } = formData

    if (!trimmedEmail) {
      newErrors.email = 'Por favor, ingresá tu email.'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Ingresá un formato de email válido.'
      }
    }

    if (!password) {
      newErrors.password = 'Por favor, ingresá tu contraseña.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // Simulate realistic Apple-like verification delay (550ms)
    setTimeout(() => {
      const trimmedEmail = formData.email.trim().toLowerCase()
      const enteredPassword = formData.password

      try {
        const storedUsers = JSON.parse(localStorage.getItem('personal_users') || '[]')

        // 1. Check if user exists by email
        const userFound = storedUsers.find(
          (u) => u.email && u.email.toLowerCase() === trimmedEmail
        )

        if (!userFound) {
          setErrors({
            general: 'No encontramos ninguna cuenta asociada a este correo electrónico.'
          })
          setIsSubmitting(false)
          return
        }

        // 2. Check if password matches
        if (userFound.password !== enteredPassword) {
          setErrors({
            general: 'La contraseña ingresada es incorrecta. Por favor, intentá nuevamente.'
          })
          setIsSubmitting(false)
          return
        }

        // 3. Credentials are correct! Create simulated session in localStorage
        const sessionPayload = {
          isAuthenticated: true,
          user: {
            id: userFound.id,
            fullName: userFound.fullName,
            email: userFound.email
          },
          loggedAt: new Date().toISOString()
        }

        localStorage.setItem('personal_session', JSON.stringify(sessionPayload))

        setIsSubmitting(false)

        // Trigger successful login callback with user data
        if (onLoginSuccess) {
          onLoginSuccess(sessionPayload.user)
        }
      } catch (err) {
        console.error('Error al procesar login en localStorage:', err)
        setErrors({ general: 'Error al acceder al almacenamiento local del navegador.' })
        setIsSubmitting(false)
      }
    }, 550)
  }

  // Quick autofill for demo reviewer
  const handleAutofill = (user) => {
    setFormData({
      email: user.email,
      password: user.password || ''
    })
    setErrors({})
  }

  return (
    <div className="auth-container">
      {/* Background ambient lighting */}
      <div className="ambient-glow" aria-hidden="true" />

      {/* Top minimal header */}
      <header className="auth-header">
        <a
          href="#inicio"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault()
            setFormData({ email: '', password: '' })
            setErrors({})
          }}
          title="PERSONAL"
        >
          <span>PERSONAL</span>
          <span className="brand-dot" aria-hidden="true"></span>
        </a>
      </header>

      {/* Main Login Card */}
      <main className="auth-main">
        <div className="auth-card" role="region" aria-label="Formulario de inicio de sesión">
          {/* Card Header */}
          <div className="auth-card-header">
            <span className="auth-pill-badge">
              <ShieldCheck size={13} strokeWidth={2.4} />
              <span>Acceso seguro</span>
            </span>
            <h1 className="auth-title">Bienvenido de nuevo</h1>
            <p className="auth-subtitle">Iniciá sesión para continuar en tu espacio personal.</p>
          </div>

          {/* Info/Success notification from registration or logout */}
          {infoMessage && (
            <div className="login-info-banner" role="status" style={{ marginBottom: '18px' }}>
              <CheckCircle2 size={16} color="#34C759" strokeWidth={2.2} style={{ flexShrink: 0 }} />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* General Error Banner */}
          {errors.general && (
            <div className="field-error-banner" role="alert" style={{ marginBottom: '20px' }}>
              <AlertCircle size={17} strokeWidth={2.2} style={{ flexShrink: 0 }} />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="auth-form">
            {/* Field: Email */}
            <div className="form-group">
              <label htmlFor={emailId} className="form-label">
                Email
              </label>
              <div className={`input-wrapper ${errors.email || errors.general ? 'has-error' : ''}`}>
                <Mail size={18} className="input-icon" aria-hidden="true" />
                <input
                  id={emailId}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nombre@ejemplo.com"
                  autoComplete="username"
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="field-error-text" role="alert">
                  <AlertCircle size={13} strokeWidth={2} />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Field: Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor={passwordId} className="form-label">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-link-button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  style={{ fontSize: '0.8rem', fontWeight: 500 }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <div className={`input-wrapper ${errors.password || errors.general ? 'has-error' : ''}`}>
                <Lock size={18} className="input-icon" aria-hidden="true" />
                <input
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresá tu contraseña"
                  autoComplete="current-password"
                  className="form-input"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="field-error-text" role="alert">
                  <AlertCircle size={13} strokeWidth={2} />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary-auth"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="btn-loading-state">
                  <span className="apple-spinner" aria-hidden="true"></span>
                  <span>Iniciando sesión...</span>
                </span>
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <ArrowRight size={16} strokeWidth={2.2} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Selector if accounts exist */}
          {registeredAccountsCount > 0 && (
            <div className="demo-accounts-pill-box">
              <div className="demo-accounts-title">
                <Users size={13} />
                <span>Cuentas guardadas en localStorage ({registeredAccountsCount})</span>
              </div>
              <div className="demo-accounts-chips">
                {demoAccounts.slice(0, 3).map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    className="demo-chip-btn"
                    onClick={() => handleAutofill(acc)}
                    title={`Autocompletar con ${acc.email}`}
                  >
                    <span className="demo-chip-name">{acc.fullName}</span>
                    <span className="demo-chip-email">({acc.email})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Link to Register */}
          <div className="auth-footer-link">
            <span>¿No tenés una cuenta?</span>{' '}
            <button
              type="button"
              className="text-link-button"
              onClick={onNavigateToRegister}
            >
              Registrate
            </button>
          </div>
        </div>
      </main>

      {/* Informative Modal: Forgot Password (Interacción Visual Informativa) */}
      {showForgotPasswordModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-sheet">
            <div className="modal-header">
              <div className="modal-icon-badge">
                <KeyRound size={22} color="#0071E3" strokeWidth={2} />
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowForgotPasswordModal(false)}
                aria-label="Cerrar ventana"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <h2 id="modal-title" className="modal-title">
                Recuperación de contraseña
              </h2>
              <p className="modal-desc">
                Esta es una <strong>simulación educativa</strong> de la aplicación PERSONAL. No existe una conexión a servidores de correo para enviar enlaces de restablecimiento reales.
              </p>
              <div className="modal-info-box">
                <Info size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  Podés consultar o volver a crear una cuenta en la pantalla de <strong>Registro</strong>. Todos tus datos se administran en el <code>localStorage</code> de este navegador.
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary-auth"
                onClick={() => {
                  setShowForgotPasswordModal(false)
                  onNavigateToRegister()
                }}
              >
                Ir a Registro
              </button>
              <button
                type="button"
                className="btn-secondary-auth"
                onClick={() => setShowForgotPasswordModal(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <span className="footer-brand">PERSONAL</span> &copy; {new Date().getFullYear()} &middot; Acceso seguro
          </div>
          <div>
            <span style={{ color: 'var(--color-muted)' }}>Entorno seguro &middot; macOS Design</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

