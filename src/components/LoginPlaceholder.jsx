import React, { useState, useEffect } from 'react'
import { LogIn, ArrowRight, ArrowLeft, Users, ShieldCheck, Sparkles, UserPlus } from 'lucide-react'

export default function LoginPlaceholder({ onNavigateToRegister, onNavigateToPrivateArea }) {
  const [storedUsers, setStoredUsers] = useState([])

  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem('personal_users') || '[]')
      setStoredUsers(users)
    } catch {
      setStoredUsers([])
    }
  }, [])

  return (
    <div className="auth-container">
      <div className="ambient-glow" aria-hidden="true" />

      <header className="auth-header">
        <a
          href="#inicio"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault()
            onNavigateToPrivateArea()
          }}
          title="Volver al Área Privada"
        >
          <span>PERSONAL</span>
          <span className="brand-dot" aria-hidden="true"></span>
        </a>
      </header>

      <main className="auth-main">
        <div className="auth-card" role="region" aria-label="Inicio de sesión">
          <div className="auth-card-header">
            <span className="auth-pill-badge">
              <Sparkles size={13} strokeWidth={2.4} />
              <span>Próxima etapa</span>
            </span>
            <h1 className="auth-title">Iniciar sesión</h1>
            <p className="auth-subtitle">Acceso a tu espacio personal.</p>
          </div>

          <div className="educational-note-box" style={{ marginBottom: '24px' }}>
            <ShieldCheck size={18} strokeWidth={2} className="note-icon" />
            <div>
              <strong>Módulo en preparación:</strong>
              <p style={{ marginTop: '4px', fontSize: '0.85rem' }}>
                De acuerdo a la planificación del proyecto, la autenticación funcional de Login se implementará en la siguiente fase.
              </p>
            </div>
          </div>

          {storedUsers.length > 0 && (
            <div className="stored-users-box">
              <div className="stored-users-header">
                <Users size={15} />
                <span>Usuarios registrados en localStorage ({storedUsers.length})</span>
              </div>
              <ul className="stored-users-list">
                {storedUsers.map((user) => (
                  <li key={user.id} className="stored-user-item">
                    <div className="user-avatar-circle">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{user.fullName}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="auth-actions-group">
            <button
              type="button"
              className="btn-primary-auth"
              onClick={onNavigateToPrivateArea}
            >
              <span>Ingresar al Área Privada</span>
              <ArrowRight size={16} strokeWidth={2} />
            </button>

            <button
              type="button"
              className="btn-secondary-auth"
              onClick={onNavigateToRegister}
            >
              <UserPlus size={15} strokeWidth={2} />
              <span>Ir a Formulario de Registro</span>
            </button>
          </div>

          <div className="auth-footer-link" style={{ marginTop: '20px' }}>
            <button
              type="button"
              className="text-link-button"
              onClick={onNavigateToRegister}
            >
              <ArrowLeft size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              <span>Volver a Crear cuenta</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <span className="footer-brand">PERSONAL</span> &copy; {new Date().getFullYear()} &middot; Próxima etapa: Login
          </div>
          <div>
            <button
              type="button"
              className="text-link-muted"
              onClick={onNavigateToPrivateArea}
            >
              Ver Área Privada
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

