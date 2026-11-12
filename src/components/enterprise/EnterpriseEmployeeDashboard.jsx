import React, { useState, useEffect } from 'react'
import {
  Building2,
  FileText,
  Folder,
  Layers,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  Users,
  Bell,
  X,
  ExternalLink
} from 'lucide-react'
import { getEnterpriseDocs } from '../../services/storage'

export default function EnterpriseEmployeeDashboard({
  currentUser,
  onLogout,
  onShowToast,
  onNavigateToPersonal
}) {
  const [docs, setDocs] = useState([])
  const [activeTab, setActiveTab] = useState('docs') // 'docs' | 'projects' | 'news'
  const [previewDoc, setPreviewDoc] = useState(null)

  useEffect(() => {
    setDocs(getEnterpriseDocs())
  }, [])

  const firstName = currentUser?.fullName ? currentUser.fullName.trim().split(' ')[0] : 'Empleado'

  const corporateProjects = [
    {
      id: 'proj_1',
      name: 'NEXORA Cloud Engine v3',
      department: 'Ingeniería',
      progress: 78,
      status: 'En curso',
      lead: 'Lucas Martínez',
      deadline: 'Q1 2027'
    },
    {
      id: 'proj_2',
      name: 'Auditoría Global de Seguridad y Privacidad',
      department: 'Ciberseguridad',
      progress: 92,
      status: 'Fase Final',
      lead: 'Sofía Rossi',
      deadline: 'Diciembre 2026'
    },
    {
      id: 'proj_3',
      name: 'Expansión de Plataforma y Alianzas B2B',
      department: 'Desarrollo Corporativo',
      progress: 45,
      status: 'Planificación',
      lead: 'Dirección Comercial',
      deadline: 'Q2 2027'
    }
  ]

  const internalNews = [
    {
      id: 'news_1',
      date: '10 de Noviembre, 2026',
      title: 'Actualización en las políticas de trabajo remoto y beneficios 2027',
      sender: 'People & Culture',
      excerpt: 'Se encuentra disponible en el repositorio de documentos la nueva versión del manual de beneficios para todo el equipo.'
    },
    {
      id: 'news_2',
      date: '02 de Noviembre, 2026',
      title: 'Nueva versión del sistema de control de accesos RBAC',
      sender: 'Seguridad Informática',
      excerpt: 'Recordamos a todos los empleados verificar que sus terminales cuenten con la actualización de seguridad instalada.'
    }
  ]

  return (
    <div className="enterprise-employee-layout">
      {/* Top Navbar */}
      <header className="enterprise-topbar-employee">
        <div className="topbar-employee-inner">
          <div className="brand-group">
            <span className="enterprise-brand-logo">
              <Building2 size={20} color="#06B6D4" />
              <span>NEXORA</span>
            </span>
            <span className="employee-authorized-badge">
              <ShieldCheck size={12} />
              <span>Empleado Autorizado</span>
            </span>
          </div>

          <div className="employee-nav-center">
            <button
              type="button"
              className={`emp-nav-pill ${activeTab === 'docs' ? 'active' : ''}`}
              onClick={() => setActiveTab('docs')}
            >
              <FileText size={14} />
              <span>Documentos ({docs.length})</span>
            </button>
            <button
              type="button"
              className={`emp-nav-pill ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <Folder size={14} />
              <span>Proyectos ({corporateProjects.length})</span>
            </button>
            <button
              type="button"
              className={`emp-nav-pill ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              <Bell size={14} />
              <span>Comunicaciones</span>
            </button>
          </div>

          <div className="employee-nav-right">
            <div className="employee-profile-pill">
              <div className="emp-avatar">
                {currentUser.fullName.trim().charAt(0).toUpperCase()}
              </div>
              <div className="emp-names">
                <span className="emp-name-text">{currentUser.fullName}</span>
                <span className="emp-email-text">{currentUser.email}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-emp-secondary"
              onClick={onNavigateToPersonal}
              title="Ir a PERSONAL individual"
            >
              <ArrowLeft size={14} />
              <span>PERSONAL</span>
            </button>

            <button
              type="button"
              className="btn-emp-logout"
              onClick={onLogout}
              title="Cerrar sesión corporativa"
            >
              <LogOut size={15} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="employee-main-container">
        {/* Hero Welcome */}
        <div className="employee-welcome-banner">
          <div className="welcome-badge">
            <Sparkles size={13} color="#06B6D4" />
            <span>Portal Corporativo NEXORA &middot; Sesión Activa</span>
          </div>
          <h1 className="employee-welcome-title">{`¡Hola, ${firstName}!`}</h1>
          <p className="employee-welcome-sub">
            Tenés acceso autorizado a los recursos, proyectos y documentación de NEXORA Corporation.
          </p>
        </div>

        {/* TAB 1: CORPORATE DOCS */}
        {activeTab === 'docs' && (
          <section className="employee-section-block">
            <div className="section-head-row">
              <div>
                <h2 className="section-heading">Documentación y Repositorio Clasificado</h2>
                <p className="section-subtext">Material corporativo protegido disponible para tu rol.</p>
              </div>
              <div className="docs-counter-tag">
                {docs.length} documentos disponibles
              </div>
            </div>

            <div className="employee-docs-grid">
              {docs.map((doc) => (
                <div key={doc.id} className="employee-doc-card">
                  <div className="doc-card-top-row">
                    <span className="doc-category-badge">{doc.category}</span>
                    <span className="doc-classification-tag">{doc.classification}</span>
                  </div>

                  <h3 className="doc-card-heading">{doc.title}</h3>
                  <p className="doc-card-summary">{doc.summary}</p>

                  <div className="doc-card-info-row">
                    <span>Versión: <strong>{doc.version}</strong></span>
                    <span>Tamaño: <strong>{doc.size}</strong></span>
                    <span>Actualizado: <strong>{doc.updatedAt}</strong></span>
                  </div>

                  <div className="doc-card-actions">
                    <button
                      type="button"
                      className="btn-emp-action-preview"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye size={14} />
                      <span>Vista previa</span>
                    </button>

                    <button
                      type="button"
                      className="btn-emp-action-download"
                      onClick={() => {
                        if (onShowToast) {
                          onShowToast({
                            title: 'Descarga de documento',
                            message: `Documento corporativo "${doc.title}" descargado.`,
                            type: 'success'
                          })
                        }
                      }}
                    >
                      <Download size={14} />
                      <span>Descargar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: CORPORATE PROJECTS */}
        {activeTab === 'projects' && (
          <section className="employee-section-block">
            <div className="section-head-row">
              <div>
                <h2 className="section-heading">Proyectos Corporativos Activos</h2>
                <p className="section-subtext">Iniciativas en desarrollo dentro de NEXORA.</p>
              </div>
            </div>

            <div className="projects-grid">
              {corporateProjects.map((p) => (
                <div key={p.id} className="corporate-project-card">
                  <div className="project-top-row">
                    <span className="project-dept-tag">{p.department}</span>
                    <span className="project-status-badge">{p.status}</span>
                  </div>

                  <h3 className="project-name">{p.name}</h3>

                  <div className="project-progress-wrapper">
                    <div className="progress-label-row">
                      <span>Avance de entregables</span>
                      <strong>{p.progress}%</strong>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="project-meta-footer">
                    <span>Líder: <strong>{p.lead}</strong></span>
                    <span>Entrega: <strong>{p.deadline}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: COMMUNICATIONS & NEWS */}
        {activeTab === 'news' && (
          <section className="employee-section-block">
            <div className="section-head-row">
              <div>
                <h2 className="section-heading">Comunicaciones y Circulares Internas</h2>
                <p className="section-subtext">Anuncios oficiales para el personal autorizado de NEXORA.</p>
              </div>
            </div>

            <div className="news-timeline-list">
              {internalNews.map((n) => (
                <div key={n.id} className="news-card">
                  <div className="news-meta-row">
                    <span className="news-sender-badge">{n.sender}</span>
                    <span className="news-date">{n.date}</span>
                  </div>
                  <h3 className="news-title">{n.title}</h3>
                  <p className="news-excerpt">{n.excerpt}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal: Document Preview */}
      {previewDoc && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="enterprise-modal-sheet">
            <div className="enterprise-modal-header">
              <div className="modal-icon-cyan">
                <FileText size={22} color="#06B6D4" />
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPreviewDoc(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="enterprise-modal-body">
              <span className="doc-classification-tag" style={{ marginBottom: '8px', display: 'inline-block' }}>
                {previewDoc.classification}
              </span>
              <h3 className="modal-title-doc">{previewDoc.title}</h3>
              <p className="modal-text">{previewDoc.summary}</p>

              <div className="doc-full-meta-card">
                <div className="doc-meta-item">
                  <span className="meta-k">Categoría:</span>
                  <span className="meta-v">{previewDoc.category}</span>
                </div>
                <div className="doc-meta-item">
                  <span className="meta-k">Versión:</span>
                  <span className="meta-v">{previewDoc.version}</span>
                </div>
                <div className="doc-meta-item">
                  <span className="meta-k">Departamento:</span>
                  <span className="meta-v">{previewDoc.author}</span>
                </div>
                <div className="doc-meta-item">
                  <span className="meta-k">Tamaño:</span>
                  <span className="meta-v">{previewDoc.size}</span>
                </div>
              </div>
            </div>

            <div className="enterprise-modal-actions">
              <button
                type="button"
                className="btn-primary-cyan"
                onClick={() => {
                  setPreviewDoc(null)
                  if (onShowToast) {
                    onShowToast({
                      title: 'Descarga simulada',
                      message: `Descargando "${previewDoc.title}"...`,
                      type: 'success'
                    })
                  }
                }}
              >
                <Download size={14} />
                <span>Descargar copia de demostración</span>
              </button>
              <button
                type="button"
                className="btn-secondary-cancel"
                onClick={() => setPreviewDoc(null)}
              >
                Cerrar vista previa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="enterprise-auth-footer">
        <p>&copy; {new Date().getFullYear()} NEXORA &middot; PERSONAL ENTERPRISES</p>
      </footer>
    </div>
  )
}

