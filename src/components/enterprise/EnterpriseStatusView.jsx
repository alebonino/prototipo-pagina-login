import React from 'react'
import {
  Clock,
  UserX,
  ShieldAlert,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Building2,
  Lock,
  Mail
} from 'lucide-react'

export default function EnterpriseStatusView({
  type, // 'pending' | 'revoked' | 'denied'
  currentUser,
  onLogout,
  onNavigateToPersonal,
  onNavigateToEnterpriseLogin,
  onCheckStatusAgain
}) {
  return (
    <div className="enterprise-auth-container">
      <div className="enterprise-ambient-glow" aria-hidden="true" />

      {/* Header */}
      <header className="enterprise-auth-header">
        <button
          type="button"
          className="btn-enterprise-back-link"
          onClick={onNavigateToPersonal}
        >
          <ArrowLeft size={15} />
          <span>Volver a PERSONAL</span>
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
          onClick={onLogout}
        >
          <LogOut size={14} />
          <span>Cerrar sesión</span>
        </button>
      </header>

      {/* Main Status Sheet */}
      <main className="enterprise-auth-main">
        <div className="enterprise-status-sheet" role="region" aria-label="Aviso de estado de autorización">
          {/* TYPE: PENDING (e.g. Martín or new registration) */}
          {type === 'pending' && (
            <>
              <div className="status-badge-icon-lg is-pending">
                <Clock size={40} color="#F59E0B" />
              </div>
              <span className="status-pill-tag is-pending">Autorización Pendiente</span>
              <h1 className="status-title">Cuenta pendiente de aprobación</h1>
              <p className="status-desc">
                {currentUser ? (
                  <>
                    Hola <strong>{currentUser.fullName}</strong>. Tu cuenta corporativa (<code>{currentUser.email}</code>)
                    fue creada y está registrada en NEXORA, pero todavía necesita la autorización del administrador
                    para acceder al contenido confidencial de la empresa.
                  </>
                ) : (
                  'Esta cuenta corporativa ha sido registrada pero aún no ha sido autorizada por el administrador de NEXORA.'
                )}
              </p>

              <div className="status-details-box">
                <div className="details-row">
                  <span>Organización:</span>
                  <strong>NEXORA Corporation</strong>
                </div>
                <div className="details-row">
                  <span>Rol solicitado:</span>
                  <code>enterprise_employee</code>
                </div>
                <div className="details-row">
                  <span>Estado de acceso:</span>
                  <span className="text-yellow font-semibold">Pendiente de revisión</span>
                </div>
              </div>

              <div className="status-help-note">
                <Mail size={16} />
                <span>
                  El administrador de la empresa (<code>admin@nexora.demo</code>) puede autorizar tu solicitud desde el panel de administración.
                </span>
              </div>

              <div className="status-actions-group">
                {onCheckStatusAgain && (
                  <button
                    type="button"
                    className="btn-enterprise-primary-full"
                    onClick={onCheckStatusAgain}
                  >
                    <RefreshCw size={15} />
                    <span>Comprobar estado de autorización</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn-enterprise-secondary-full"
                  onClick={onLogout}
                >
                  <LogOut size={15} />
                  <span>Cerrar sesión e intentar más tarde</span>
                </button>
              </div>
            </>
          )}

          {/* TYPE: REVOKED (when admin revoked permissions) */}
          {type === 'revoked' && (
            <>
              <div className="status-badge-icon-lg is-revoked">
                <UserX size={40} color="#EF4444" />
              </div>
              <span className="status-pill-tag is-revoked">Acceso Revocado</span>
              <h1 className="status-title">Autorización corporativa revocada</h1>
              <p className="status-desc">
                El acceso a la documentación y recursos de NEXORA para la cuenta{' '}
                <strong>{currentUser?.email || 'corporativa'}</strong> ha sido revocado por la administración.
              </p>

              <div className="status-details-box">
                <div className="details-row">
                  <span>Empresa:</span>
                  <strong>NEXORA Corporation</strong>
                </div>
                <div className="details-row">
                  <span>Estado actual:</span>
                  <span className="text-red font-semibold">Permiso Revocado (revoked)</span>
                </div>
                <div className="details-row">
                  <span>Contenido corporativo:</span>
                  <span className="text-red">Acceso denegado</span>
                </div>
              </div>

              <div className="status-help-note">
                <ShieldAlert size={16} />
                <span>
                  Si considerás que se trata de un error, contactá con el administrador en <code>admin@nexora.demo</code>.
                </span>
              </div>

              <div className="status-actions-group">
                <button
                  type="button"
                  className="btn-enterprise-primary-full"
                  onClick={onLogout}
                >
                  <LogOut size={15} />
                  <span>Finalizar sesión</span>
                </button>

                <button
                  type="button"
                  className="btn-enterprise-secondary-full"
                  onClick={onNavigateToPersonal}
                >
                  <ArrowLeft size={15} />
                  <span>Ir a la plataforma PERSONAL individual</span>
                </button>
              </div>
            </>
          )}

          {/* TYPE: DENIED / RESTRICTED (unauthorized route access) */}
          {type === 'denied' && (
            <>
              <div className="status-badge-icon-lg is-denied">
                <Lock size={40} color="#EF4444" />
              </div>
              <span className="status-pill-tag is-revoked">Acceso Restringido</span>
              <h1 className="status-title">Contenido no autorizado</h1>
              <p className="status-desc">
                No tenés los permisos o la sesión requerida para consultar este contenido corporativo protegido.
              </p>

              <div className="status-actions-group">
                <button
                  type="button"
                  className="btn-enterprise-primary-full"
                  onClick={onNavigateToEnterpriseLogin}
                >
                  <span>Ir a Iniciar sesión corporativa</span>
                </button>

                <button
                  type="button"
                  className="btn-enterprise-secondary-full"
                  onClick={onNavigateToPersonal}
                >
                  <ArrowLeft size={15} />
                  <span>Volver a PERSONAL</span>
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="enterprise-auth-footer">
        <p>&copy; {new Date().getFullYear()} NEXORA &middot; Control de Accesos y Seguridad</p>
      </footer>
    </div>
  )
}

