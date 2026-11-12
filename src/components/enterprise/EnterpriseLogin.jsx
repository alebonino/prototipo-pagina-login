import React, { useState, useId } from 'react'
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Users,
  CheckCircle2,
  Info
} from 'lucide-react'
import { getStoredUsers, setActiveSession } from '../../services/storage'

export default function EnterpriseLogin({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToLanding,
  onNavigateToPersonal,
  prefillEmail,
  infoMessage
}) {
  const [formData, setFormData] = useState({
    email: prefillEmail || '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emailId = useId()
  const passwordId = useId()

  const demoQuickChips = [
    { label: 'Admin', email: 'admin@nexora.demo', pass: 'NexoraAdmin2026!', badge: 'Admin' },
    { label: 'Lucas', email: 'lucas@nexora.demo', pass: 'Lucas2026!', badge: 'Autorizado' },
    { label: 'Sofía', email: 'sofia@nexora.demo', pass: 'Sofia2026!', badge: 'Autorizada' },
    { label: 'Martín', email: 'martin@nexora.demo', pass: 'Martin2026!', badge: 'Pendiente' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
        general: null
      }))
    }
  }

  const handleQuickAutofill = (email, pass) => {
    setFormData({ email, password: pass })
    setErrors({})
  }

  const validate = () => {
    const newErrors = {}
    const trimmedEmail = formData.email.trim()

    if (!trimmedEmail) {
      newErrors.email = 'Por favor, ingresá el email corporativo.'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Ingresá un formato de correo válido.'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Por favor, ingresá tu contraseña.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    setTimeout(() => {
      const trimmedEmail = formData.email.trim().toLowerCase()
      const enteredPassword = formData.password

      try {
        const users = getStoredUsers()
        const userFound = users.find(
          (u) => u.email && u.email.toLowerCase() === trimmedEmail
        )

        // 1. User not found
        if (!userFound) {
          setErrors({
            general: 'No se encontró ningún usuario corporativo con este email en NEXORA.'
          })
          setIsSubmitting(false)
          return
        }

        // 2. Wrong password
        if (userFound.password !== enteredPassword) {
          setErrors({
            general: 'La contraseña corporativa es incorrecta. Verificala cuidadosamente.'
          })
          setIsSubmitting(false)
          return
        }

        // 3. User is an individual personal_user
        if (userFound.role === 'personal_user') {
          setErrors({
            general: 'Esta cuenta está registrada como usuario individual de PERSONAL. Para acceder a tu espacio personal, ingresá al portal individual.',
            isPersonalUser: true
          })
          setIsSubmitting(false)
          return
        }

        // 4. Set session
        setActiveSession(userFound)
        setIsSubmitting(false)

        // 5. Trigger routing callback
        if (onLoginSuccess) {
          onLoginSuccess(userFound)
        }
      } catch (err) {
        console.error('Error al procesar login corporativo:', err)
        setErrors({ general: 'Ocurrió un error al verificar las credenciales en localStorage.' })
        setIsSubmitting(false)
      }
    }, 550)
  }

  return (
    <div className="enterprise-auth-container">
      <div className="enterprise-ambient-glow" aria-hidden="true" />

      {/* Top Header */}
      <header className="enterprise-auth-header">
        <button
          type="button"
          className="btn-enterprise-back-link"
          onClick={onNavigateToLanding}
        >
          <ArrowLeft size={15} />
          <span>Portal Empresas</span>
        </button>

        <div className="enterprise-header-logo-group">
          <Building2 size={20} className="header-enterprise-icon" />
          <span className="brand-logo-text">
            <span>PERSONAL</span>
            <span className="brand-cyan-text">ENTERPRISES</span>
          </span>
          <span className="header-company-pill">NEXORA</span>
        </div>

        <button
          type="button"
          className="btn-enterprise-back-link"
          onClick={onNavigateToPersonal}
        >
          <span>Ir a PERSONAL</span>
        </button>
      </header>

      {/* Main Card */}
      <main className="enterprise-auth-main">
        <div className="enterprise-auth-card" role="region" aria-label="Inicio de sesión empresarial">
          <div className="enterprise-card-header">
            <span className="enterprise-card-badge">
              <ShieldCheck size={13} />
              <span>Acceso Corporativo NEXORA</span>
            </span>
            <h1 className="enterprise-card-title">Iniciar sesión</h1>
            <p className="enterprise-card-subtitle">
              Ingresá con tu cuenta corporativa para acceder a tu panel de trabajo.
            </p>
          </div>

          {/* Info Banner */}
          {infoMessage && (
            <div className="enterprise-info-banner" role="status">
              <CheckCircle2 size={16} color="#06B6D4" style={{ flexShrink: 0 }} />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* General Error Banner */}
          {errors.general && (
            <div className="enterprise-error-banner" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <span>{errors.general}</span>
                {errors.isPersonalUser && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      type="button"
                      className="btn-enterprise-outline-sm"
                      onClick={onNavigateToPersonal}
                    >
                      Ir al Login de PERSONAL individual
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Autofill Chips */}
          <div className="enterprise-quick-chips-box">
            <div className="quick-chips-header">
              <Users size={13} />
              <span>Cuentas demo para probar:</span>
            </div>
            <div className="quick-chips-row">
              {demoQuickChips.map((chip) => (
                <button
                  key={chip.email}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => handleQuickAutofill(chip.email, chip.pass)}
                  title={`Cargar ${chip.email}`}
                >
                  <span className="chip-name">{chip.label}</span>
                  <span className="chip-badge">{chip.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="enterprise-form">
            <div className="form-group">
              <label htmlFor={emailId} className="enterprise-form-label">
                Email corporativo
              </label>
              <div className={`enterprise-input-wrapper ${errors.email || errors.general ? 'has-error' : ''}`}>
                <Mail size={18} className="enterprise-input-icon" />
                <input
                  id={emailId}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@nexora.demo"
                  autoComplete="username"
                  className="enterprise-input"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="enterprise-error-text" role="alert">
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={passwordId} className="enterprise-form-label">
                Contraseña corporativa
              </label>
              <div className={`enterprise-input-wrapper ${errors.password || errors.general ? 'has-error' : ''}`}>
                <Lock size={18} className="enterprise-input-icon" />
                <input
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="enterprise-input"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="enterprise-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="enterprise-error-text" role="alert">
                  <AlertCircle size={13} />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-enterprise-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="btn-loading-state">
                  <span className="enterprise-spinner"></span>
                  <span>Verificando permisos en NEXORA...</span>
                </span>
              ) : (
                <>
                  <span>Ingresar a NEXORA</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="enterprise-card-footer-links">
            <p>
              ¿Sos un empleado nuevo de NEXORA?{' '}
              <button
                type="button"
                className="enterprise-link-btn"
                onClick={onNavigateToRegister}
              >
                Solicitar registro
              </button>
            </p>
          </div>

          <div className="enterprise-disclaimer-box">
            <Info size={14} className="disclaimer-info-icon" />
            <span>
              Simulación de control de accesos RBAC. Las cuentas no autorizadas podrán iniciar sesión pero tendrán el acceso a datos corporativos bloqueado.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="enterprise-auth-footer">
        <p>&copy; {new Date().getFullYear()} NEXORA &middot; PERSONAL ENTERPRISES</p>
      </footer>
    </div>
  )
}

