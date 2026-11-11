import React, { useState } from 'react'
import { User, Folder, Layers, ArrowUpRight, LogOut, ShieldCheck, Sparkles, CheckCircle2, UserPlus } from 'lucide-react'

export default function PrivateArea({ onNavigateToRegister, currentUser, onLogout, onShowToast }) {
  const [activeToast, setActiveToast] = useState(null)

  const firstName = currentUser?.fullName ? currentUser.fullName.trim().split(' ')[0] : 'Usuario'

  const handleCardClick = (title) => {
    const toastPayload = {
      title: title,
      message: `Has seleccionado "${title}". Módulo listo para integración.`,
      type: 'info'
    }

    if (onShowToast) {
      onShowToast(toastPayload)
    } else {
      setActiveToast(toastPayload)
      setTimeout(() => {
        setActiveToast(null)
      }, 3200)
    }
  }

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout()
    } else if (onNavigateToRegister) {
      onNavigateToRegister()
    }
  }

  const cardsData = [
    {
      id: 'espacio',
      title: 'Mi espacio',
      description: 'Tu espacio personal para organizar tus ideas.',
      icon: User,
      badge: 'Espacio activo',
      indicator: 'Sincronizado'
    },
    {
      id: 'proyectos',
      title: 'Mis proyectos',
      description: 'Consultá y organizá tus proyectos.',
      icon: Folder,
      badge: 'Gestor',
      indicator: 'Actualizado'
    },
    {
      id: 'recursos',
      title: 'Mis recursos',
      description: 'Accedé a tus recursos y contenido exclusivo.',
      icon: Layers,
      badge: 'Exclusivo',
      indicator: 'Disponible'
    }
  ]

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="nav-brand-group">
            <a href="#inicio" className="brand-logo" aria-label="PERSONAL Inicio">
              <span>PERSONAL</span>
              <span className="brand-dot" aria-hidden="true"></span>
            </a>

            {/* Private Area Indicator */}
            <div className="private-status-badge" role="status" title="Conexión segura activa">
              <span className="status-indicator-dot" aria-hidden="true"></span>
              <span>Área privada</span>
            </div>

            {currentUser?.fullName && (
              <div className="user-profile-badge" title={`Sesión activa: ${currentUser.email}`}>
                <span className="user-avatar-dot">{currentUser.fullName.trim().charAt(0).toUpperCase()}</span>
                <span className="user-name-label">{currentUser.fullName}</span>
              </div>
            )}
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="btn-secondary-nav"
              onClick={onNavigateToRegister}
              title="Ir al formulario de Registro"
            >
              <UserPlus size={14} strokeWidth={2} />
              <span>Registrar nueva cuenta</span>
            </button>
            <button
              type="button"
              className="btn-logout"
              onClick={handleLogoutClick}
              aria-label="Cerrar sesión actual"
            >
              <span>Cerrar sesión</span>
              <LogOut size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero Header */}
        <section className="hero-section">
          <div className="hero-pill-badge">
            <ShieldCheck size={14} strokeWidth={2.4} />
            <span>Área privada</span>
          </div>
          <h1 className="hero-title">{`¡Hola, ${firstName}!`}</h1>
          <h2 className="hero-welcome">Bienvenido nuevamente a tu espacio personal.</h2>
          <p className="hero-description">
            Todo lo que necesitás, organizado en un solo lugar.
          </p>
        </section>

        {/* Content Cards Grid */}
        <section className="cards-grid" aria-label="Secciones del área privada">
          {cardsData.map((card) => {
            const IconComponent = card.icon
            return (
              <article
                key={card.id}
                className="content-card"
                onClick={() => handleCardClick(card.title)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick(card.title)
                  }
                }}
                aria-label={`Acceder a ${card.title}: ${card.description}`}
              >
                {/* Header row: Icon & Action arrow */}
                <div className="card-header-row">
                  <div className="card-icon-container">
                    <IconComponent size={24} strokeWidth={1.85} />
                  </div>
                  <div className="card-action-arrow" aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={2.2} />
                  </div>
                </div>

                {/* Body: Title & Description */}
                <div className="card-body">
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                </div>

                {/* Footer: Visual indicator & CTA */}
                <div className="card-footer">
                  <div className="card-indicator">
                    <span className="card-indicator-dot" aria-hidden="true"></span>
                    <span>{card.indicator}</span>
                  </div>
                  <span className="card-cta-label">Abrir</span>
                </div>
              </article>
            )
          })}
        </section>

        {/* Subtle macOS Dock-inspired System Status Pill */}
        <div className="status-dock" role="region" aria-label="Estado del sistema">
          <div className="dock-info">
            <div className="dock-badge-icon" aria-hidden="true">
              <Sparkles size={16} strokeWidth={2} />
            </div>
            <div className="dock-text">
              <strong>PERSONAL Core</strong> &mdash; Entorno optimizado y seguro.
            </div>
          </div>
          <div className="dock-meta">
            <span>Diseño macOS · v1.0</span>
          </div>
        </div>
      </main>

      {/* Modern Minimalist Toast Notification (only if not using unified parent toast) */}
      {!onShowToast && activeToast && (
        <aside
          role="status"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'rgba(29, 29, 31, 0.94)',
            color: '#FFFFFF',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '14px 20px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.86rem',
            zIndex: 1000,
            maxWidth: '380px',
            animation: 'hero-fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <CheckCircle2 size={18} color="#34C759" strokeWidth={2.2} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: '2px' }}>{activeToast.title}</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.76)', fontSize: '0.8rem' }}>{activeToast.message}</div>
          </div>
        </aside>
      )}
    </>
  )
}

