import React, { useState, useId } from 'react'
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Clock,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { getStoredUsers, saveUser, addAuditLog } from '../../services/storage'

export default function EnterpriseRegister({
  onNavigateToLogin,
  onNavigateToLanding,
  onNavigateToPersonal
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
  const [registeredEmployee, setRegisteredEmployee] = useState(null)

  const fullNameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()

  const PRE_AUTHORIZED_EMAILS = [
    'admin@nexora.demo',
    'lucas@nexora.demo',
    'sofia@nexora.demo'
  ]

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
    const trimmedEmail = formData.email.trim().toLowerCase()
    const { password, confirmPassword } = formData

    if (!trimmedName || trimmedName.length < 3) {
      newErrors.fullName = 'Por favor, ingresá tu nombre y apellido completos.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Ingresá un formato de email corporativo válido.'
    } else {
      const existingUsers = getStoredUsers()
      if (existingUsers.some((u) => u.email && u.email.toLowerCase() === trimmedEmail)) {
        newErrors.email = 'Este email ya está registrado en el sistema. Probá iniciar sesión.'
      }
    }

    if (!password || password.length < 8) {
      newErrors.password = 'La contraseña corporativa debe tener al menos 8 caracteres.'
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
      const trimmedEmail = formData.email.trim().toLowerCase()
      const cleanName = formData.fullName.trim()

      // Determine initial authorization status:
      // If email is in PRE_AUTHORIZED_EMAILS -> 'authorized', else -> 'pending'
      const isPreAuthorized = PRE_AUTHORIZED_EMAILS.includes(trimmedEmail)
      const initialStatus = isPreAuthorized ? 'authorized' : 'pending'

      const newEmployee = {
        id: `emp_${Date.now()}`,
        fullName: cleanName,
        email: trimmedEmail,
        password: formData.password,
        role: 'enterprise_employee', // Strict role assignment
        company: 'NEXORA',
        status: initialStatus,
        createdAt: new Date().toISOString()
      }

      try {
        saveUser(newEmployee)
        addAuditLog(
          'REGISTRO_EMPLEADO',
          `Nuevo registro de empleado: ${cleanName} (${trimmedEmail}). Estado: ${initialStatus === 'authorized' ? 'Autorizado' : 'Pendiente de autorización'}.`,
          trimmedEmail
        )

        setRegisteredEmployee(newEmployee)
        setIsSubmitting(false)
      } catch (err) {
        console.error('Error al guardar empleado:', err)
        setErrors({ general: 'Ocurrió un error al registrar en localStorage.' })
        setIsSubmitting(false)
      }
    }, 600)
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

      {/* Main Form Center Card */}
      <main className="enterprise-auth-main">
        {registeredEmployee ? (
          <div className="enterprise-auth-card success-card" role="region" aria-label="Resultado de registro">
            <div className={`enterprise-status-icon-badge ${registeredEmployee.status === 'authorized' ? 'is-authorized' : 'is-pending'}`}>
              {registeredEmployee.status === 'authorized' ? (
                <CheckCircle2 size={36} color="#06B6D4" />
              ) : (
                <Clock size={36} color="#F59E0B" />
              )}
            </div>

            <div className="enterprise-card-header">
              <span className={`enterprise-card-badge ${registeredEmployee.status === 'authorized' ? 'badge-authorized' : 'badge-pending'}`}>
                {registeredEmployee.status === 'authorized' ? 'Cuenta Autorizada' : 'Pendiente de Autorización'}
              </span>
              <h1 className="enterprise-card-title">
                {registeredEmployee.status === 'authorized'
                  ? '¡Cuenta corporativa activada!'
                  : 'Solicitud de acceso enviada'}
              </h1>
              <p className="enterprise-card-subtitle">
                {registeredEmployee.status === 'authorized'
                  ? `Bienvenido/a al equipo de NEXORA, ${registeredEmployee.fullName}. Tu cuenta ya se encuentra autorizada.`
                  : `Tu cuenta ha sido creada, pero requiere autorización de NEXORA para acceder al contenido corporativo protegido.`}
              </p>
            </div>

            <div className="enterprise-summary-box">
              <div className="summary-row">
                <span className="summary-label">Empleado:</span>
                <span className="summary-val">{registeredEmployee.fullName}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Email corporativo:</span>
                <span className="summary-val">{registeredEmployee.email}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Rol asignado:</span>
                <span className="summary-val">enterprise_employee</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Estado de autorización:</span>
                <span className={`status-pill ${registeredEmployee.status === 'authorized' ? 'pill-green' : 'pill-yellow'}`}>
                  {registeredEmployee.status === 'authorized' ? 'Autorizado' : 'Pendiente de aprobación'}
                </span>
              </div>
            </div>

            <div className="enterprise-info-note">
              <Info size={16} />
              <p>
                {registeredEmployee.status === 'authorized'
                  ? 'Podés iniciar sesión ahora mismo para acceder a la documentación y proyectos corporativos.'
                  : 'El administrador (admin@nexora.demo) puede autorizar tu cuenta desde el Panel de Gestión de Empleados en cualquier momento.'}
              </p>
            </div>

            <div className="enterprise-actions-col">
              <button
                type="button"
                className="btn-enterprise-submit"
                onClick={() => onNavigateToLogin(registeredEmployee.email)}
              >
                <span>Continuar a Iniciar sesión</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="enterprise-auth-card" role="region" aria-label="Formulario de registro empresarial">
            <div className="enterprise-card-header">
              <span className="enterprise-card-badge">
                <Building2 size={13} />
                <span>NEXORA &middot; Registro de Empleados</span>
              </span>
              <h1 className="enterprise-card-title">Solicitar acceso</h1>
              <p className="enterprise-card-subtitle">
                Completá tus datos para crear tu cuenta corporativa en NEXORA.
              </p>
            </div>

            {errors.general && (
              <div className="enterprise-error-banner" role="alert">
                <AlertCircle size={18} />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="enterprise-form">
              <div className="form-group">
                <label htmlFor={fullNameId} className="enterprise-form-label">
                  Nombre completo
                </label>
                <div className={`enterprise-input-wrapper ${errors.fullName ? 'has-error' : ''}`}>
                  <User size={18} className="enterprise-input-icon" />
                  <input
                    id={fullNameId}
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nombre y apellido"
                    autoComplete="name"
                    className="enterprise-input"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.fullName && (
                  <p className="enterprise-error-text" role="alert">
                    <AlertCircle size={13} />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={emailId} className="enterprise-form-label">
                  Email corporativo
                </label>
                <div className={`enterprise-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                  <Mail size={18} className="enterprise-input-icon" />
                  <input
                    id={emailId}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tunombre@nexora.demo"
                    autoComplete="email"
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
                <div className={`enterprise-input-wrapper ${errors.password ? 'has-error' : ''}`}>
                  <Lock size={18} className="enterprise-input-icon" />
                  <input
                    id={passwordId}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
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

              <div className="form-group">
                <label htmlFor={confirmPasswordId} className="enterprise-form-label">
                  Confirmar contraseña
                </label>
                <div className={`enterprise-input-wrapper ${errors.confirmPassword ? 'has-error' : ''}`}>
                  <Lock size={18} className="enterprise-input-icon" />
                  <input
                    id={confirmPasswordId}
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repetí la contraseña"
                    autoComplete="new-password"
                    className="enterprise-input"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="enterprise-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Ver confirmación'}
                    tabIndex={0}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="enterprise-error-text" role="alert">
                    <AlertCircle size={13} />
                    <span>{errors.confirmPassword}</span>
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
                    <span>Registrando empleado en NEXORA...</span>
                  </span>
                ) : (
                  <span>Crear cuenta corporativa</span>
                )}
              </button>
            </form>

            <div className="enterprise-card-footer-links">
              <p>
                ¿Ya tenés cuenta en NEXORA?{' '}
                <button
                  type="button"
                  className="enterprise-link-btn"
                  onClick={() => onNavigateToLogin()}
                >
                  Iniciar sesión
                </button>
              </p>
            </div>

            <div className="enterprise-disclaimer-box">
              <Sparkles size={14} className="disclaimer-info-icon" />
              <span>
                Nota: Se te asignará automáticamente el rol <code>enterprise_employee</code>. El rol <code>enterprise_admin</code> no puede crearse desde este formulario.
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="enterprise-auth-footer">
        <p>&copy; {new Date().getFullYear()} NEXORA &middot; PERSONAL ENTERPRISES</p>
      </footer>
    </div>
  )
}

