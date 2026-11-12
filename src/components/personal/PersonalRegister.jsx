import React, { useState, useId } from 'react'
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info,
  ArrowLeft,
  Building2
} from 'lucide-react'
import { getStoredUsers, saveUser } from '../../services/storage'

export default function PersonalRegister({
  onNavigateToLogin,
  onNavigateToLanding,
  onNavigateToEnterprise
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registeredSuccessUser, setRegisteredSuccessUser] = useState(null)

  const fullNameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'transparent' }

    let score = 0
    if (pwd.length >= 8) score += 1
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    switch (score) {
      case 1:
        return { score: 1, label: 'Débil', color: '#FF3B30' }
      case 2:
        return { score: 2, label: 'Media', color: '#FF9500' }
      case 3:
        return { score: 3, label: 'Fuerte', color: '#34C759' }
      case 4:
        return { score: 4, label: 'Excelente', color: '#0071E3' }
      default:
        return { score: 1, label: 'Muy corta (mín. 8 caracteres)', color: '#FF3B30' }
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    setErrors((prev) => {
      const updated = { ...prev, [name]: null }
      if (name === 'password' || name === 'confirmPassword') {
        if (prev.confirmPassword && prev.confirmPassword.includes('coinciden')) {
          updated.confirmPassword = null
        }
      }
      return updated
    })
  }

  const validate = () => {
    const newErrors = {}
    const trimmedName = formData.fullName.trim()
    const trimmedEmail = formData.email.trim()
    const { password, confirmPassword } = formData

    if (!trimmedName) {
      newErrors.fullName = 'Por favor, ingresá tu nombre completo.'
    } else if (trimmedName.length < 3) {
      newErrors.fullName = 'El nombre debe contener al menos 3 caracteres.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail) {
      newErrors.email = 'Por favor, ingresá tu dirección de email.'
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Ingresá un formato de email válido (ej. usuario@correo.com).'
    } else {
      const storedUsers = getStoredUsers()
      const emailExists = storedUsers.some(
        (user) => user.email && user.email.toLowerCase() === trimmedEmail.toLowerCase()
      )
      if (emailExists) {
        newErrors.email = 'Este email ya está registrado. Probá iniciar sesión o usar otro.'
      }
    }

    if (!password) {
      newErrors.password = 'Por favor, creá una contraseña.'
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe contener al menos 8 caracteres.'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Por favor, confirmá tu contraseña.'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden. Verificalas cuidadosamente.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    setTimeout(() => {
      const cleanName = formData.fullName.trim()
      const cleanEmail = formData.email.trim()

      const newUser = {
        id: `usr_${Date.now()}`,
        fullName: cleanName,
        email: cleanEmail,
        password: formData.password,
        role: 'personal_user', // Automatic individual role as requested
        status: 'authorized',
        createdAt: new Date().toISOString()
      }

      try {
        saveUser(newUser)
        setRegisteredSuccessUser(newUser)
        setIsSubmitting(false)
      } catch (err) {
        console.error('Error al guardar en localStorage:', err)
        setErrors({ general: 'Ocurrió un error al guardar los datos en este navegador.' })
        setIsSubmitting(false)
      }
    }, 550)
  }

  return (
    <div className="auth-container">
      <div className="ambient-glow" aria-hidden="true" />

      {/* Top Header */}
      <header className="auth-header auth-header-flex">
        <button
          type="button"
          className="btn-back-link"
          onClick={onNavigateToLanding}
          title="Volver a la página principal"
        >
          <ArrowLeft size={15} />
          <span>Inicio</span>
        </button>

        <a
          href="#inicio"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault()
            onNavigateToLanding()
          }}
          title="PERSONAL Inicio"
        >
          <span>PERSONAL</span>
          <span className="brand-dot" aria-hidden="true"></span>
        </a>

        <button
          type="button"
          className="btn-enterprise-portal-pill-sm"
          onClick={onNavigateToEnterprise}
          title="Ir al Portal Empresas"
        >
          <Building2 size={13} />
          <span>Empresas</span>
        </button>
      </header>

      {/* Main Form Center Card */}
      <main className="auth-main">
        {registeredSuccessUser ? (
          <div className="auth-card success-card" role="region" aria-label="Registro individual exitoso">
            <div className="success-icon-badge">
              <CheckCircle2 size={36} color="#34C759" strokeWidth={2.2} />
            </div>

            <div className="auth-card-header">
              <span className="auth-pill-badge success-pill">
                <Sparkles size={13} strokeWidth={2.4} />
                <span>Registro completado</span>
              </span>
              <h1 className="auth-title">¡Cuenta creada con éxito!</h1>
              <p className="auth-subtitle">
                Bienvenido/a a <strong>PERSONAL</strong>, <strong>{registeredSuccessUser.fullName}</strong>.
              </p>
            </div>

            <div className="success-user-summary">
              <div className="summary-row">
                <span className="summary-label">Email registrado:</span>
                <span className="summary-value">{registeredSuccessUser.email}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tipo de cuenta:</span>
                <span className="summary-value">Usuario Individual (personal_user)</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Almacenamiento:</span>
                <span className="summary-value status-badge-ok">Guardado localmente</span>
              </div>
            </div>

            <div className="educational-note-box">
              <Info size={16} strokeWidth={2} className="note-icon" />
              <p>
                <strong>Simulación educativa:</strong> Tu cuenta individual fue guardada en el{' '}
                <code>localStorage</code>. Podés iniciar sesión ahora mismo con tus credenciales.
              </p>
            </div>

            <div className="auth-actions-group">
              <button
                type="button"
                className="btn-primary-auth"
                onClick={() => onNavigateToLogin(registeredSuccessUser.email)}
              >
                <span>Ir a Iniciar sesión</span>
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-card" role="region" aria-label="Formulario de creación de cuenta individual">
            <div className="auth-card-header">
              <span className="auth-pill-badge">
                <User size={13} strokeWidth={2.4} />
                <span>Nuevo usuario individual</span>
              </span>
              <h1 className="auth-title">Crear cuenta</h1>
              <p className="auth-subtitle">Empezá a disfrutar de tu espacio personal.</p>
            </div>

            {errors.general && (
              <div className="field-error-banner" role="alert">
                <AlertCircle size={16} />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="auth-form">
              {/* Field: Full Name */}
              <div className="form-group">
                <label htmlFor={fullNameId} className="form-label">
                  Nombre completo
                </label>
                <div className={`input-wrapper ${errors.fullName ? 'has-error' : ''}`}>
                  <User size={18} className="input-icon" aria-hidden="true" />
                  <input
                    id={fullNameId}
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Tu nombre y apellido"
                    autoComplete="name"
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.fullName && (
                  <p className="field-error-text" role="alert">
                    <AlertCircle size={13} strokeWidth={2} />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Field: Email */}
              <div className="form-group">
                <label htmlFor={emailId} className="form-label">
                  Email personal
                </label>
                <div className={`input-wrapper ${errors.email ? 'has-error' : ''}`}>
                  <Mail size={18} className="input-icon" aria-hidden="true" />
                  <input
                    id={emailId}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nombre@ejemplo.com"
                    autoComplete="email"
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
                <label htmlFor={passwordId} className="form-label">
                  Contraseña
                </label>
                <div className={`input-wrapper ${errors.password ? 'has-error' : ''}`}>
                  <Lock size={18} className="input-icon" aria-hidden="true" />
                  <input
                    id={passwordId}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
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

                {formData.password.length > 0 && (
                  <div className="password-strength-container" aria-live="polite">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className="strength-bar-segment"
                          style={{
                            backgroundColor:
                              step <= passwordStrength.score ? passwordStrength.color : 'rgba(0,0,0,0.08)'
                          }}
                        />
                      ))}
                    </div>
                    <div className="strength-caption">
                      <span>Fortaleza:</span>
                      <strong style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </strong>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="field-error-text" role="alert">
                    <AlertCircle size={13} strokeWidth={2} />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Field: Confirm Password */}
              <div className="form-group">
                <label htmlFor={confirmPasswordId} className="form-label">
                  Confirmar contraseña
                </label>
                <div className={`input-wrapper ${errors.confirmPassword ? 'has-error' : ''}`}>
                  <Lock size={18} className="input-icon" aria-hidden="true" />
                  <input
                    id={confirmPasswordId}
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repetí tu contraseña"
                    autoComplete="new-password"
                    className="form-input"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Ver confirmación'}
                    tabIndex={0}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="field-error-text" role="alert">
                    <AlertCircle size={13} strokeWidth={2} />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="btn-primary-auth"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="btn-loading-state">
                    <span className="apple-spinner" aria-hidden="true"></span>
                    <span>Creando cuenta...</span>
                  </span>
                ) : (
                  <span>Registrarme en PERSONAL</span>
                )}
              </button>
            </form>

            <div className="auth-footer-link">
              <span>¿Ya tenés una cuenta?</span>{' '}
              <button
                type="button"
                className="text-link-button"
                onClick={() => onNavigateToLogin()}
              >
                Iniciar sesión
              </button>
            </div>

            <div className="educational-disclaimer">
              <ShieldAlert size={14} className="disclaimer-icon" />
              <span>
                Simulación con fines educativos. Los datos se guardan exclusivamente en el localStorage del navegador.
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <span className="footer-brand">PERSONAL</span> &copy; {new Date().getFullYear()} &middot; Registro Individual
          </div>
          <div>
            <button
              type="button"
              className="text-link-muted"
              onClick={() => onNavigateToEnterprise()}
            >
              Portal Empresas
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

