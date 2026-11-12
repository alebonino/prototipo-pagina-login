import React from 'react'
import {
  Building2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Users,
  FileText,
  Activity,
  UserCheck,
  UserX,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react'

export default function EnterpriseLanding({
  onNavigateToEnterpriseLogin,
  onNavigateToEnterpriseRegister,
  onNavigateToPersonal,
  onQuickDemoLogin
}) {
  const demoAccounts = [
    {
      role: 'Administrador',
      email: 'admin@nexora.demo',
      password: 'NexoraAdmin2026!',
      status: 'authorized',
      badge: 'Control Total',
      badgeClass: 'badge-admin',
      desc: 'Accede al panel completo, gestión de empleados, documentos y auditoría.'
    },
    {
      role: 'Empleado Autorizado',
      email: 'lucas@nexora.demo',
      password: 'Lucas2026!',
      status: 'authorized',
      badge: 'Autorizado',
      badgeClass: 'badge-authorized',
      desc: 'Acceso completo a la documentación corporativa y proyectos de NEXORA.'
    },
    {
      role: 'Empleado Autorizada',
      email: 'sofia@nexora.demo',
      password: 'Sofia2026!',
      status: 'authorized',
      badge: 'Autorizada',
      badgeClass: 'badge-authorized',
      desc: 'Acceso completo al repositorio corporativo y recursos internos.'
    },
    {
      role: 'Empleado No Autorizado',
      email: 'martin@nexora.demo',
      password: 'Martin2026!',
      status: 'pending',
      badge: 'Pendiente',
      badgeClass: 'badge-pending',
      desc: 'Cuenta registrada pero sin autorización previa. Recibe pantalla de acceso restringido.'
    }
  ]

  return (
    <div className="enterprise-landing-wrapper">
      {/* Ambient dark glow */}
      <div className="enterprise-ambient-glow" aria-hidden="true" />

      {/* Top Navbar */}
      <nav className="enterprise-nav">
        <div className="enterprise-nav-inner">
          <div className="enterprise-nav-brand">
            <span className="enterprise-brand-logo">
              <Building2 size={20} className="enterprise-brand-icon" />
              <span>PERSONAL</span>
              <span className="brand-accent-text">ENTERPRISES</span>
            </span>
            <span className="enterprise-company-badge">NEXORA</span>
          </div>

          <div className="enterprise-nav-links">
            <a href="#demo-accounts" className="enterprise-nav-link">Cuentas Demo</a>
            <a href="#seguridad" className="enterprise-nav-link">Gobernanza RBAC</a>
            <a href="#documentos" className="enterprise-nav-link">Repositorio</a>
          </div>

          <div className="enterprise-nav-actions">
            <button
              type="button"
              className="btn-back-to-personal"
              onClick={onNavigateToPersonal}
              title="Volver a la plataforma individual PERSONAL"
            >
              <ArrowLeft size={14} />
              <span>Volver a PERSONAL</span>
            </button>

            <button
              type="button"
              className="btn-enterprise-ghost"
              onClick={onNavigateToEnterpriseLogin}
            >
              Acceso Corporativo
            </button>

            <button
              type="button"
              className="btn-enterprise-primary"
              onClick={onNavigateToEnterpriseRegister}
            >
              <span>Solicitar Acceso</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="enterprise-hero">
        <div className="enterprise-container">
          <div className="enterprise-hero-badge">
            <ShieldCheck size={14} />
            <span>Portal Corporativo NEXORA &middot; Seguridad y Control de Empleados</span>
          </div>

          <h1 className="enterprise-hero-title">
            Gobernanza y control de accesos<br />
            <span className="enterprise-gradient-text">para organizaciones modernas.</span>
          </h1>

          <p className="enterprise-hero-subtitle">
            Un portal empresarial independiente que separa estrictamente la experiencia individual
            de los permisos corporativos. Validación de empleados, revocación instantánea y repositorio confidencial.
          </p>

          <div className="enterprise-hero-actions">
            <button
              type="button"
              className="btn-enterprise-hero-primary"
              onClick={onNavigateToEnterpriseLogin}
            >
              <span>Ingresar al Portal Corporativo</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="btn-enterprise-hero-secondary"
              onClick={onNavigateToEnterpriseRegister}
            >
              <span>Registro de Nuevos Empleados</span>
            </button>
          </div>

          {/* Demonstration Accounts Grid */}
          <div id="demo-accounts" className="enterprise-demo-showcase">
            <div className="demo-showcase-header">
              <div className="showcase-header-left">
                <Sparkles size={18} color="#06B6D4" />
                <h3>Cuentas de demostración precargadas (NEXORA)</h3>
              </div>
              <span className="showcase-header-pill">Simulación educativa lista para probar</span>
            </div>

            <div className="demo-accounts-grid">
              {demoAccounts.map((acc) => (
                <div key={acc.email} className="demo-account-card">
                  <div className="demo-card-top">
                    <span className="demo-role-name">{acc.role}</span>
                    <span className={`demo-status-badge ${acc.badgeClass}`}>
                      {acc.badge}
                    </span>
                  </div>

                  <div className="demo-credentials-box">
                    <div className="demo-cred-row">
                      <span className="cred-label">Email:</span>
                      <code className="cred-val">{acc.email}</code>
                    </div>
                    <div className="demo-cred-row">
                      <span className="cred-label">Pass:</span>
                      <code className="cred-val">{acc.password}</code>
                    </div>
                  </div>

                  <p className="demo-account-desc">{acc.desc}</p>

                  <button
                    type="button"
                    className="btn-quick-login-chip"
                    onClick={() => onQuickDemoLogin(acc.email, acc.password)}
                    title={`Iniciar sesión como ${acc.email}`}
                  >
                    <span>Probar este usuario</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="seguridad" className="enterprise-section">
        <div className="enterprise-container">
          <div className="enterprise-section-header">
            <span className="enterprise-tag-cyan">Control de Identidades</span>
            <h2 className="enterprise-section-title">
              Arquitectura de autorización de tres niveles
            </h2>
            <p className="enterprise-section-desc">
              Registrarse no significa estar autorizado. Cada cuenta corporativa debe ser validada o aprobada por el administrador de NEXORA.
            </p>
          </div>

          <div className="enterprise-features-grid">
            <div className="enterprise-feature-card">
              <div className="feature-card-icon-cyan">
                <Users size={24} />
              </div>
              <h3>Gestión de Empleados</h3>
              <p>
                Visualización centralizada de todos los empleados registrados, con búsqueda en tiempo real y filtrado por estado.
              </p>
              <div className="feature-stat-pill">Autorizado / Pendiente / Revocado</div>
            </div>

            <div className="enterprise-feature-card">
              <div className="feature-card-icon-cyan">
                <UserCheck size={24} />
              </div>
              <h3>Autorización Inmediata</h3>
              <p>
                El administrador puede aprobar solicitudes pendientes con un solo clic. El empleado obtiene acceso sin recargar la app.
              </p>
              <div className="feature-stat-pill">Persistencia en localStorage</div>
            </div>

            <div className="enterprise-feature-card">
              <div className="feature-card-icon-cyan">
                <UserX size={24} />
              </div>
              <h3>Revocación Instantánea</h3>
              <p>
                Ante la baja de un empleado, el administrador revoca su autorización con confirmación de seguridad. Su sesión queda bloqueada al instante.
              </p>
              <div className="feature-stat-pill">Protección en tiempo real</div>
            </div>

            <div className="enterprise-feature-card">
              <div className="feature-card-icon-cyan">
                <FileText size={24} />
              </div>
              <h3>Documentos Clasificados</h3>
              <p>
                Área de archivos corporativos con niveles de confidencialidad, accesible exclusivamente para usuarios con autorización activa.
              </p>
              <div className="feature-stat-pill">Bloqueado a no autorizados</div>
            </div>

            <div className="enterprise-feature-card">
              <div className="feature-card-icon-cyan">
                <Activity size={24} />
              </div>
              <h3>Trazabilidad &amp; Auditoría</h3>
              <p>
                Historial continuo de cambios de permisos, registros de nuevos miembros e inicios de sesión corporativos.
              </p>
              <div className="feature-stat-pill">Logs en vivo</div>
            </div>

            <div className="enterprise-feature-card">
              <div className="feature-card-icon-cyan">
                <Lock size={24} />
              </div>
              <h3>Aislamiento Total</h3>
              <p>
                Los usuarios registrados en PERSONAL individual no pueden acceder a los datos de la empresa, y viceversa.
              </p>
              <div className="feature-stat-pill">Cero filtración de datos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="enterprise-footer">
        <div className="enterprise-container footer-enterprise-flex">
          <div className="footer-enterprise-brand">
            <div className="enterprise-brand-logo">
              <Building2 size={18} />
              <span>PERSONAL ENTERPRISES</span>
            </div>
            <p>Portal empresarial para NEXORA &middot; Simulación de gobernanza RBAC</p>
          </div>

          <div className="footer-enterprise-actions">
            <button
              type="button"
              className="btn-back-to-personal-footer"
              onClick={onNavigateToPersonal}
            >
              <ArrowLeft size={14} />
              <span>Regresar al portal de usuarios individuales</span>
            </button>
          </div>
        </div>
        <div className="enterprise-container footer-enterprise-sub">
          <p>&copy; {new Date().getFullYear()} NEXORA / PERSONAL ENTERPRISES. Simulación educativa en React.</p>
        </div>
      </footer>
    </div>
  )
}

