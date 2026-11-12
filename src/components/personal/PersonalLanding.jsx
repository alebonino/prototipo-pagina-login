import React from 'react'
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Folder,
  User,
  Zap,
  Lock,
  Building2,
  CheckCircle2,
  LayoutGrid,
  ChevronRight,
  Sliders,
  Laptop
} from 'lucide-react'

export default function PersonalLanding({
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToEnterprise,
  currentUser,
  onNavigateToPrivate
}) {
  return (
    <div className="landing-wrapper">
      {/* Background ambient lighting */}
      <div className="ambient-glow" aria-hidden="true" />

      {/* Top Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <span className="brand-logo">
              <span>PERSONAL</span>
              <span className="brand-dot" aria-hidden="true"></span>
            </span>
            <span className="brand-pill-tag">Individual</span>
          </div>

          <div className="landing-nav-links">
            <a href="#caracteristicas" className="landing-nav-link">Características</a>
            <a href="#como-funciona" className="landing-nav-link">Cómo funciona</a>
            <a href="#seguridad" className="landing-nav-link">Seguridad</a>
          </div>

          <div className="landing-nav-actions">
            {/* Enterprise Portal Switcher Button */}
            <button
              type="button"
              className="btn-enterprise-portal-pill"
              onClick={onNavigateToEnterprise}
              title="Acceder a PERSONAL ENTERPRISES (Portal Corporativo)"
            >
              <Building2 size={14} className="enterprise-icon" />
              <span>Portal Empresas</span>
              <span className="enterprise-badge-tag">NEXORA</span>
            </button>

            {currentUser ? (
              <button
                type="button"
                className="btn-primary-compact"
                onClick={onNavigateToPrivate}
              >
                <span>Ir a mi Área Privada</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-ghost-nav"
                  onClick={onNavigateToLogin}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  className="btn-primary-compact"
                  onClick={onNavigateToRegister}
                >
                  <span>Crear cuenta</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="landing-container">
          <div className="hero-announcement-badge">
            <Sparkles size={13} className="sparkle-icon" />
            <span>PERSONAL 2.0 &middot; Estética inspirada en Apple y Linear</span>
          </div>

          <h1 className="landing-hero-title">
            Tu espacio personal,<br />
            <span className="gradient-text">organizado con precisión.</span>
          </h1>

          <p className="landing-hero-subtitle">
            La plataforma individual creada para estructurar tus ideas, proyectos y recursos
            con una experiencia visual sofisticada, limpia y sin sobrecargas.
          </p>

          <div className="hero-cta-group">
            {currentUser ? (
              <button
                type="button"
                className="btn-hero-primary"
                onClick={onNavigateToPrivate}
              >
                <span>Continuar a mi espacio ({currentUser.fullName.split(' ')[0]})</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-hero-primary"
                  onClick={onNavigateToRegister}
                >
                  <span>Empezar ahora gratis</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className="btn-hero-secondary"
                  onClick={onNavigateToLogin}
                >
                  <span>Iniciar sesión</span>
                </button>
              </>
            )}
          </div>

          {/* Abstract Modern UI Mockup / Showcase */}
          <div className="hero-showcase-container">
            <div className="hero-mockup-frame">
              {/* Window controls macOS style */}
              <div className="mockup-header-bar">
                <div className="window-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="mockup-url-bar">
                  <Lock size={12} className="lock-icon" />
                  <span>personal.app / mi-espacio</span>
                </div>
                <div className="mockup-actions-fake">
                  <span className="pill-fake">v2.0</span>
                </div>
              </div>

              {/* Mockup Content Grid */}
              <div className="mockup-body">
                <div className="mockup-welcome-row">
                  <div>
                    <h2 className="mockup-user-title">Bienvenido a tu espacio personal</h2>
                    <p className="mockup-user-sub">Todo lo que necesitás, organizado en un solo lugar.</p>
                  </div>
                  <div className="mockup-status-indicator">
                    <span className="pulse-green-dot"></span>
                    <span>Sincronizado</span>
                  </div>
                </div>

                <div className="mockup-cards-row">
                  <div className="mockup-card">
                    <div className="mockup-card-icon-box">
                      <User size={20} color="#0071E3" />
                    </div>
                    <h3 className="mockup-card-title">Mi espacio</h3>
                    <p className="mockup-card-desc">Tus notas, prioridades diarias y espacio creativo.</p>
                    <div className="mockup-metric-pill">4 módulos activos</div>
                  </div>

                  <div className="mockup-card">
                    <div className="mockup-card-icon-box">
                      <Folder size={20} color="#0071E3" />
                    </div>
                    <h3 className="mockup-card-title">Mis proyectos</h3>
                    <p className="mockup-card-desc">Control ágil de tareas personales y hojas de ruta.</p>
                    <div className="mockup-metric-pill">12 tareas completadas</div>
                  </div>

                  <div className="mockup-card">
                    <div className="mockup-card-icon-box">
                      <Layers size={20} color="#0071E3" />
                    </div>
                    <h3 className="mockup-card-title">Mis recursos</h3>
                    <p className="mockup-card-desc">Documentación, enlaces clave y archivos esenciales.</p>
                    <div className="mockup-metric-pill">8 archivos guardados</div>
                  </div>
                </div>

                {/* Floating Micro-widgets */}
                <div className="mockup-widgets-row">
                  <div className="mockup-mini-widget">
                    <Zap size={14} color="#0071E3" />
                    <span>Rendimiento: 99.8%</span>
                  </div>
                  <div className="mockup-mini-widget">
                    <ShieldCheck size={14} color="#34C759" />
                    <span>Entorno local seguro</span>
                  </div>
                  <div className="mockup-mini-widget">
                    <Sliders size={14} color="#FF9500" />
                    <span>Modo minimalista activo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="caracteristicas" className="landing-section">
        <div className="landing-container">
          <div className="section-header-centered">
            <span className="section-badge">Excelencia en cada detalle</span>
            <h2 className="section-title">Diseñado para personas que valoran la claridad.</h2>
            <p className="section-subtitle">
              Sin menús complicados ni paneles sobrecargados. Cada elemento tiene un propósito.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Laptop size={24} />
              </div>
              <h3 className="feature-title">Interfaz macOS &amp; Linear</h3>
              <p className="feature-desc">
                Colores serenos, bordes sutiles y esquinas redondeadas pensadas para largas jornadas de trabajo sin fatiga visual.
              </p>
              <div className="feature-tag">Diseño Premium</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={24} />
              </div>
              <h3 className="feature-title">Privacidad Estricta</h3>
              <p className="feature-desc">
                Tus datos de usuario residen localmente en tu navegador sin rastreadores invasivos ni servidores de terceros.
              </p>
              <div className="feature-tag">Almacenamiento Local</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={24} />
              </div>
              <h3 className="feature-title">Fluidez Instantánea</h3>
              <p className="feature-desc">
                Transiciones instantáneas con animaciones con curvas Apple <code>cubic-bezier(0.16, 1, 0.3, 1)</code>.
              </p>
              <div className="feature-tag">Sin Latencia</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Building2 size={24} />
              </div>
              <h3 className="feature-title">Escala Corporativa</h3>
              <p className="feature-desc">
                ¿Tu equipo creció? Conectá directamente con <strong>PERSONAL ENTERPRISES</strong> para gobernanza de roles y empleados.
              </p>
              <div className="feature-tag">Compatible Nexora</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="landing-section bg-subtle">
        <div className="landing-container">
          <div className="section-header-centered">
            <span className="section-badge">Simplicidad en 3 pasos</span>
            <h2 className="section-title">Cómo funciona PERSONAL</h2>
            <p className="section-subtitle">Tu espacio listo en cuestión de segundos.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Creá tu cuenta</h3>
              <p className="step-desc">
                Registrate con tu nombre y correo personal. No solicitamos tarjetas ni datos innecesarios.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Iniciá sesión</h3>
              <p className="step-desc">
                Accedé con tus credenciales y tu sesión se mantendrá activa y protegida en tu dispositivo.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Disfrutá tu Área Privada</h3>
              <p className="step-desc">
                Organizá tus notas, proyectos y recursos con un saludo personalizado y módulos listos para usar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Callout Banner */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="enterprise-banner-box">
            <div className="enterprise-banner-content">
              <div className="enterprise-pill-glow">
                <Building2 size={14} />
                <span>Solución para Empresas &middot; NEXORA</span>
              </div>
              <h2 className="enterprise-banner-title">
                ¿Buscás una solución para tu organización?
              </h2>
              <p className="enterprise-banner-desc">
                Descubrí <strong>PERSONAL ENTERPRISES</strong>: el portal corporativo con panel de administración,
                gestión de empleados, solicitudes de acceso y control de documentos confidenciales.
              </p>
              <div className="enterprise-banner-actions">
                <button
                  type="button"
                  className="btn-enterprise-hero"
                  onClick={onNavigateToEnterprise}
                >
                  <span>Ingresar a PERSONAL ENTERPRISES</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="enterprise-banner-stats">
              <div className="enterprise-stat-item">
                <div className="stat-number">RBAC</div>
                <div className="stat-label">Control de Roles</div>
              </div>
              <div className="enterprise-stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Autorización Previa</div>
              </div>
              <div className="enterprise-stat-item">
                <div className="stat-number">Auditoría</div>
                <div className="stat-label">Trazabilidad Total</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="landing-section-cta">
        <div className="landing-container">
          <div className="cta-box">
            <h2 className="cta-title">Comenzá a ordenar tu día hoy mismo</h2>
            <p className="cta-subtitle">
              Sumate a la plataforma individual diseñada para elevar tu productividad.
            </p>
            <div className="cta-buttons">
              <button
                type="button"
                className="btn-primary-large"
                onClick={onNavigateToRegister}
              >
                <span>Crear mi cuenta gratuita</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container footer-flex">
          <div className="footer-left">
            <div className="brand-logo">
              <span>PERSONAL</span>
              <span className="brand-dot"></span>
            </div>
            <p className="footer-tagline">
              Espacio personal para usuarios individuales &middot; Simulación educativa con React y localStorage.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4>Plataforma</h4>
              <button type="button" onClick={onNavigateToLogin}>Iniciar sesión</button>
              <button type="button" onClick={onNavigateToRegister}>Crear cuenta</button>
              <button type="button" onClick={onNavigateToPrivate}>Área privada</button>
            </div>

            <div className="footer-column">
              <h4>Corporativo</h4>
              <button type="button" onClick={onNavigateToEnterprise} className="footer-link-highlight">
                Portal Empresas (NEXORA)
              </button>
              <span>Acceso Administrador</span>
              <span>Gestión de Empleados</span>
            </div>
          </div>
        </div>

        <div className="landing-container footer-bottom">
          <p>&copy; {new Date().getFullYear()} PERSONAL. Todos los derechos reservados.</p>
          <p className="footer-note">Simulación con fines pedagógicos. No almacena contraseñas reales.</p>
        </div>
      </footer>
    </div>
  )
}

