import React, { useState } from 'react'
import {
  User,
  Folder,
  Layers,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
  Sparkles,
  Building2,
  Clock,
  Plus,
  FileText,
  CheckCircle2,
  TrendingUp,
  X,
  ExternalLink,
  Info
} from 'lucide-react'

export default function PersonalDashboard({
  currentUser,
  onLogout,
  onShowToast,
  onNavigateToEnterprise
}) {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [activeItemModal, setActiveItemModal] = useState(null)

  const firstName = currentUser?.fullName ? currentUser.fullName.trim().split(' ')[0] : 'Usuario'

  const handleCardClick = (title, details) => {
    setActiveItemModal({ title, details })
    if (onShowToast) {
      onShowToast({
        title: title,
        message: `Has seleccionado "${title}". Módulo listo para integración.`,
        type: 'info'
      })
    }
  }

  const handleQuickAction = (actionName) => {
    if (onShowToast) {
      onShowToast({
        title: actionName,
        message: `Acción rápida "${actionName}" completada en modo simulación.`,
        type: 'success'
      })
    }
  }

  const cardsData = [
    {
      id: 'espacio',
      title: 'Mi espacio',
      description: 'Tu espacio personal para organizar tus ideas y notas rápidas.',
      icon: User,
      badge: 'Espacio activo',
      indicator: 'Sincronizado',
      stats: '4 notas activas',
      details: 'Área privada dedicada a estructurar tus borradores, ideas de negocio y prioridades del día con sincronización automática en tu navegador.'
    },
    {
      id: 'proyectos',
      title: 'Mis proyectos',
      description: 'Consultá, filtrá y organizá todos tus proyectos individuales.',
      icon: Folder,
      badge: 'Gestor Ágil',
      indicator: 'Actualizado',
      stats: '3 proyectos en curso',
      details: 'Panel de gestión para tus iniciativas personales. Permite hacer seguimiento de etapas, entregables y objetivos trazados.'
    },
    {
      id: 'recursos',
      title: 'Mis recursos',
      description: 'Accedé a tus recursos digitales, plantillas y contenido exclusivo.',
      icon: Layers,
      badge: 'Exclusivo',
      indicator: 'Disponible',
      stats: '1.2 GB en uso',
      details: 'Repositorio seguro para tus archivos esenciales, configuraciones exportadas y bibliotecas de referencia personal.'
    }
  ]

  const recentActivity = [
    {
      id: 'act_1',
      title: 'Actualización en Proyecto Personal',
      time: 'Hace 25 minutos',
      category: 'Proyectos',
      badge: 'Completado'
    },
    {
      id: 'act_2',
      title: 'Sincronización de notas en Mi espacio',
      time: 'Hace 2 horas',
      category: 'Notas',
      badge: 'Sincronizado'
    },
    {
      id: 'act_3',
      title: 'Inicio de sesión seguro verificado',
      time: 'Hoy, 10:14 AM',
      category: 'Seguridad',
      badge: 'Verificado'
    }
  ]

  return (
    <div className="personal-dashboard-layout">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="nav-brand-group">
            <span className="brand-logo" aria-label="PERSONAL Inicio">
              <span>PERSONAL</span>
              <span className="brand-dot" aria-hidden="true"></span>
            </span>

            {/* Private Area Indicator */}
            <div className="private-status-badge" role="status" title="Conexión segura activa">
              <span className="status-indicator-dot" aria-hidden="true"></span>
              <span>Área privada</span>
            </div>

            {/* User Profile Pill */}
            {currentUser?.fullName && (
              <button
                type="button"
                className="user-profile-badge user-profile-clickable"
                onClick={() => setShowProfileModal(true)}
                title="Ver detalles de mi perfil"
              >
                <span className="user-avatar-dot">
                  {currentUser.fullName.trim().charAt(0).toUpperCase()}
                </span>
                <span className="user-name-label">{currentUser.fullName}</span>
              </button>
            )}
          </div>

          <div className="nav-actions">
            {/* Switch to Enterprise Portal Button */}
            <button
              type="button"
              className="btn-enterprise-portal-pill"
              onClick={onNavigateToEnterprise}
              title="Acceder al Portal Corporativo de Empresas"
            >
              <Building2 size={13} className="enterprise-icon" />
              <span>Portal Empresas</span>
            </button>

            <button
              type="button"
              className="btn-logout"
              onClick={onLogout}
              aria-label="Cerrar sesión actual"
            >
              <span>Cerrar sesión</span>
              <LogOut size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Hero Header */}
        <section className="hero-section">
          <div className="hero-pill-badge">
            <ShieldCheck size={14} strokeWidth={2.4} />
            <span>Área privada individual</span>
          </div>
          <h1 className="hero-title">{`¡Hola, ${firstName}!`}</h1>
          <h2 className="hero-welcome">Bienvenido nuevamente a tu espacio personal.</h2>
          <p className="hero-description">
            Todo lo que necesitás, organizado en un solo lugar con diseño minimalista.
          </p>
        </section>

        {/* Metric / Summary KPIs Row (Simulated Data) */}
        <section className="dashboard-stats-grid" aria-label="Resumen de espacio personal">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Espacio en uso</span>
              <TrendingUp size={16} className="stat-card-icon" />
            </div>
            <div className="stat-card-value">1.2 GB</div>
            <div className="stat-card-footnote">de 15 GB disponibles &middot; Datos simulados</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Proyectos activos</span>
              <Folder size={16} className="stat-card-icon" />
            </div>
            <div className="stat-card-value">3</div>
            <div className="stat-card-footnote">2 actualizados hoy &middot; Datos simulados</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Tareas completadas</span>
              <CheckCircle2 size={16} className="stat-card-icon" style={{ color: '#34C759' }} />
            </div>
            <div className="stat-card-value">12 / 14</div>
            <div className="stat-card-footnote">86% de productividad semanal</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Seguridad de cuenta</span>
              <ShieldCheck size={16} className="stat-card-icon" style={{ color: '#0071E3' }} />
            </div>
            <div className="stat-card-value">Protegida</div>
            <div className="stat-card-footnote">Almacenamiento local verificado</div>
          </div>
        </section>

        {/* Content Cards Grid */}
        <section className="cards-grid" aria-label="Secciones del área privada">
          {cardsData.map((card) => {
            const IconComponent = card.icon
            return (
              <article
                key={card.id}
                className="content-card"
                onClick={() => handleCardClick(card.title, card.details)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick(card.title, card.details)
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
                  <div className="card-title-row">
                    <h3 className="card-title">{card.title}</h3>
                    <span className="card-stats-tag">{card.stats}</span>
                  </div>
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

        {/* Quick Shortcuts & Recent Activity Split Grid */}
        <section className="dashboard-split-grid">
          {/* Quick Actions Panel */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <Sparkles size={16} color="#0071E3" />
                <h3 className="panel-title">Accesos rápidos</h3>
              </div>
              <span className="panel-subtitle">Acciones frecuentes</span>
            </div>

            <div className="quick-actions-list">
              <button
                type="button"
                className="btn-quick-action"
                onClick={() => handleQuickAction('Crear nueva nota')}
              >
                <div className="quick-action-icon">
                  <Plus size={16} />
                </div>
                <div className="quick-action-text">
                  <strong>Crear nueva nota rápida</strong>
                  <span>Escribir una idea en borrador</span>
                </div>
              </button>

              <button
                type="button"
                className="btn-quick-action"
                onClick={() => handleQuickAction('Subir recurso simulado')}
              >
                <div className="quick-action-icon">
                  <FileText size={16} />
                </div>
                <div className="quick-action-text">
                  <strong>Cargar recurso digital</strong>
                  <span>Guardar archivo en biblioteca personal</span>
                </div>
              </button>

              <button
                type="button"
                className="btn-quick-action"
                onClick={() => setShowProfileModal(true)}
              >
                <div className="quick-action-icon">
                  <User size={16} />
                </div>
                <div className="quick-action-text">
                  <strong>Consultar perfil y datos</strong>
                  <span>Ver información de sesión actual</span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <Clock size={16} color="#86868B" />
                <h3 className="panel-title">Actividad reciente</h3>
              </div>
              <span className="panel-subtitle">Trazabilidad en este dispositivo</span>
            </div>

            <div className="activity-timeline">
              {recentActivity.map((act) => (
                <div key={act.id} className="activity-item">
                  <div className="activity-bullet"></div>
                  <div className="activity-content">
                    <div className="activity-title-row">
                      <span className="activity-title">{act.title}</span>
                      <span className="activity-badge">{act.badge}</span>
                    </div>
                    <div className="activity-meta">
                      <span>{act.time}</span> &middot; <span>{act.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Switcher Callout in Dashboard */}
        <section className="dashboard-enterprise-callout">
          <div className="callout-icon-box">
            <Building2 size={24} color="#0071E3" />
          </div>
          <div className="callout-text-box">
            <h4>¿Sos parte de una organización corporativa?</h4>
            <p>
              Accedé a <strong>PERSONAL ENTERPRISES</strong> para colaborar dentro de NEXORA con permisos empresariales y documentación clasificada.
            </p>
          </div>
          <button
            type="button"
            className="btn-callout-action"
            onClick={onNavigateToEnterprise}
          >
            <span>Ver Portal Empresas</span>
            <ExternalLink size={14} />
          </button>
        </section>

        {/* macOS Dock-inspired System Status Pill */}
        <div className="status-dock" role="region" aria-label="Estado del sistema">
          <div className="dock-info">
            <div className="dock-badge-icon" aria-hidden="true">
              <Sparkles size={16} strokeWidth={2} />
            </div>
            <div className="dock-text">
              <strong>PERSONAL Individual</strong> &mdash; Entorno optimizado y seguro.
            </div>
          </div>
          <div className="dock-meta">
            <span>Diseño Apple &middot; Simulación Educativa</span>
          </div>
        </div>
      </main>

      {/* Modal: Card Details Preview */}
      {activeItemModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-sheet">
            <div className="modal-header">
              <div className="modal-icon-badge">
                <Sparkles size={22} color="#0071E3" />
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveItemModal(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <h3 className="modal-title">{activeItemModal.title}</h3>
              <p className="modal-desc">{activeItemModal.details}</p>
              <div className="modal-info-box">
                <Info size={16} />
                <span>
                  Este módulo está conectado a tu sesión de usuario individual. En las próximas fases se integrará el editor en vivo.
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary-auth"
                onClick={() => setActiveItemModal(null)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: User Profile */}
      {showProfileModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-sheet">
            <div className="modal-header">
              <div className="modal-icon-badge">
                <User size={22} color="#0071E3" />
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowProfileModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <h3 className="modal-title">Perfil de Usuario</h3>
              <p className="modal-desc">Detalles de tu cuenta en la plataforma PERSONAL.</p>

              <div className="profile-details-card">
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Nombre completo:</span>
                  <span className="profile-detail-value">{currentUser.fullName}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Correo registrado:</span>
                  <span className="profile-detail-value">{currentUser.email}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Rol del sistema:</span>
                  <span className="profile-role-tag">Usuario Individual (personal_user)</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Almacenamiento:</span>
                  <span className="profile-detail-value">Local (localStorage)</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Estado de sesión:</span>
                  <span className="profile-status-ok">Activo y Verificado</span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary-auth"
                onClick={() => setShowProfileModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <span className="footer-brand">PERSONAL</span> &copy; {new Date().getFullYear()} &middot; Todos los derechos reservados.
          </div>
          <div>
            <span>Privacidad &middot; Términos de Servicio</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

