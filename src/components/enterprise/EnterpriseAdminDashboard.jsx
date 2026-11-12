import React, { useState, useEffect } from 'react'
import {
  Building2,
  Users,
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  FileText,
  Activity,
  Search,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Settings,
  Download,
  Lock,
  Eye,
  RefreshCw,
  X,
  ShieldAlert
} from 'lucide-react'
import {
  getStoredUsers,
  updateEmployeeStatus,
  getEnterpriseDocs,
  getAuditLogs
} from '../../services/storage'

export default function EnterpriseAdminDashboard({
  currentUser,
  onLogout,
  onShowToast,
  onNavigateToPersonal
}) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'employees' | 'docs' | 'audit' | 'settings'
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'authorized' | 'pending' | 'revoked'
  const [docs, setDocs] = useState([])
  const [logs, setLogs] = useState([])
  const [confirmRevokeModal, setConfirmRevokeModal] = useState(null)
  const [previewDocModal, setPreviewDocModal] = useState(null)

  // Load fresh data
  const refreshData = () => {
    const allUsers = getStoredUsers()
    // Filter to only enterprise members (admin & employees)
    const enterpriseMembers = allUsers.filter(
      (u) => u.role === 'enterprise_employee' || u.role === 'enterprise_admin'
    )
    setEmployees(enterpriseMembers)
    setDocs(getEnterpriseDocs())
    setLogs(getAuditLogs())
  }

  useEffect(() => {
    refreshData()
  }, [])

  // Calculate metrics
  const totalEmployees = employees.filter((e) => e.role === 'enterprise_employee').length
  const authorizedCount = employees.filter((e) => e.role === 'enterprise_employee' && e.status === 'authorized').length
  const pendingCount = employees.filter((e) => e.role === 'enterprise_employee' && e.status === 'pending').length
  const revokedCount = employees.filter((e) => e.role === 'enterprise_employee' && e.status === 'revoked').length

  // Filtered employees for table
  const filteredEmployees = employees.filter((emp) => {
    // Exclude the current admin from the editable employee list table
    if (emp.role === 'enterprise_admin') return false

    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ? true : emp.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle Authorization Action
  const handleAuthorize = (emp) => {
    updateEmployeeStatus(emp.id, 'authorized', currentUser.email)
    refreshData()
    if (onShowToast) {
      onShowToast({
        title: 'Empleado Autorizado',
        message: `${emp.fullName} (${emp.email}) ahora tiene acceso completo al contenido de NEXORA.`,
        type: 'success'
      })
    }
  }

  // Handle Revocation Action
  const handleConfirmRevoke = () => {
    if (!confirmRevokeModal) return
    const emp = confirmRevokeModal
    updateEmployeeStatus(emp.id, 'revoked', currentUser.email)
    setConfirmRevokeModal(null)
    refreshData()
    if (onShowToast) {
      onShowToast({
        title: 'Acceso Revocado',
        message: `Se ha revocado la autorización a ${emp.fullName}. Su sesión y permisos fueron bloqueados inmediatamente.`,
        type: 'warning'
      })
    }
  }

  return (
    <div className="enterprise-admin-layout">
      {/* Sidebar Navigation */}
      <aside className="enterprise-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <Building2 size={22} color="#06B6D4" />
          </div>
          <div className="brand-text-col">
            <span className="brand-name">NEXORA</span>
            <span className="brand-sub">Panel de Administración</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity size={18} />
            <span>Resumen General</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <Users size={18} />
            <span>Gestión de Empleados</span>
            {pendingCount > 0 && (
              <span className="sidebar-badge-count">{pendingCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            <FileText size={18} />
            <span>Documentos Corporativos</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <ShieldCheck size={18} />
            <span>Auditoría &amp; Trazabilidad</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Configuración</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-user-info-card">
            <div className="admin-avatar">A</div>
            <div className="admin-meta">
              <span className="admin-name">{currentUser.fullName}</span>
              <span className="admin-role-tag">enterprise_admin</span>
            </div>
          </div>

          <div className="sidebar-actions-col">
            <button
              type="button"
              className="btn-sidebar-secondary"
              onClick={onNavigateToPersonal}
              title="Ir a PERSONAL individual"
            >
              <ArrowLeft size={14} />
              <span>Volver a PERSONAL</span>
            </button>

            <button
              type="button"
              className="btn-sidebar-logout"
              onClick={onLogout}
            >
              <LogOut size={15} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="enterprise-admin-main">
        {/* Top Header */}
        <header className="enterprise-topbar">
          <div className="topbar-title-group">
            <h1 className="topbar-title">
              {activeTab === 'overview' && 'Resumen Ejecutivo & Métricas'}
              {activeTab === 'employees' && 'Gestión y Autorización de Empleados'}
              {activeTab === 'docs' && 'Repositorio Confidencial NEXORA'}
              {activeTab === 'audit' && 'Registro de Auditoría de Permisos'}
              {activeTab === 'settings' && 'Políticas de Seguridad de la Empresa'}
            </h1>
            <p className="topbar-sub">NEXORA Corporation &middot; Sistema de Gobernanza RBAC</p>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="btn-topbar-refresh"
              onClick={refreshData}
              title="Recargar datos de localStorage"
            >
              <RefreshCw size={14} />
              <span>Actualizar datos</span>
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="enterprise-admin-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane-fade">
              {/* KPIs Row */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">Empleados Registrados</span>
                    <Users size={16} color="#06B6D4" />
                  </div>
                  <div className="kpi-value">{totalEmployees}</div>
                  <div className="kpi-footnote">Total de cuentas en NEXORA</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">Empleados Autorizados</span>
                    <UserCheck size={16} color="#10B981" />
                  </div>
                  <div className="kpi-value text-green">{authorizedCount}</div>
                  <div className="kpi-footnote">Acceso pleno a documentos privados</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">Solicitudes Pendientes</span>
                    <Clock size={16} color="#F59E0B" />
                  </div>
                  <div className="kpi-value text-yellow">{pendingCount}</div>
                  <div className="kpi-footnote">Requieren aprobación del administrador</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">Permisos Revocados</span>
                    <UserX size={16} color="#EF4444" />
                  </div>
                  <div className="kpi-value text-red">{revokedCount}</div>
                  <div className="kpi-footnote">Acceso denegado en tiempo real</div>
                </div>
              </div>

              {/* Split Content: Quick Management Preview & Recent Logs */}
              <div className="overview-split-grid">
                {/* Pending Approvals Quick Panel */}
                <div className="overview-panel">
                  <div className="panel-top-row">
                    <div className="panel-title-with-badge">
                      <Clock size={16} color="#F59E0B" />
                      <h3>Solicitudes que requieren tu atención</h3>
                    </div>
                    <button
                      type="button"
                      className="link-view-all"
                      onClick={() => {
                        setActiveTab('employees')
                        setStatusFilter('pending')
                      }}
                    >
                      Ver todos ({pendingCount})
                    </button>
                  </div>

                  {pendingCount === 0 ? (
                    <div className="empty-state-card">
                      <CheckCircle2 size={32} color="#10B981" />
                      <p>No hay solicitudes pendientes en este momento.</p>
                      <span>Todos los empleados están al día.</span>
                    </div>
                  ) : (
                    <div className="pending-list">
                      {employees
                        .filter((e) => e.role === 'enterprise_employee' && e.status === 'pending')
                        .map((emp) => (
                          <div key={emp.id} className="pending-item-card">
                            <div className="pending-user-info">
                              <strong>{emp.fullName}</strong>
                              <span>{emp.email}</span>
                            </div>
                            <div className="pending-actions">
                              <button
                                type="button"
                                className="btn-approve-sm"
                                onClick={() => handleAuthorize(emp)}
                              >
                                <UserCheck size={14} />
                                <span>Autorizar</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Recent Audit Actions */}
                <div className="overview-panel">
                  <div className="panel-top-row">
                    <div className="panel-title-with-badge">
                      <Activity size={16} color="#06B6D4" />
                      <h3>Últimas acciones registradas</h3>
                    </div>
                    <button
                      type="button"
                      className="link-view-all"
                      onClick={() => setActiveTab('audit')}
                    >
                      Ver historial
                    </button>
                  </div>

                  <div className="audit-timeline-compact">
                    {logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="audit-timeline-item">
                        <div className="audit-dot"></div>
                        <div className="audit-item-body">
                          <p className="audit-desc">{log.details}</p>
                          <span className="audit-time">
                            {new Date(log.timestamp).toLocaleString()} &middot; por {log.actor}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYEE MANAGEMENT TABLE */}
          {activeTab === 'employees' && (
            <div className="tab-pane-fade">
              {/* Search & Filters Bar */}
              <div className="table-controls-bar">
                <div className="search-input-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o correo corporativo..."
                    className="search-field"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setSearchTerm('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="status-filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    Todos ({employees.filter((e) => e.role === 'enterprise_employee').length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'authorized' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('authorized')}
                  >
                    Autorizados ({authorizedCount})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('pending')}
                  >
                    Pendientes ({pendingCount})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'revoked' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('revoked')}
                  >
                    Revocados ({revokedCount})
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="enterprise-table-container">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Empleado</th>
                      <th>Email Corporativo</th>
                      <th>Fecha de Registro</th>
                      <th>Rol Asignado</th>
                      <th>Estado</th>
                      <th style={{ textAlign: 'right' }}>Gestión de Acceso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="table-empty-row">
                          No se encontraron empleados con los criterios de búsqueda seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="table-data-row">
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-circle">
                                {emp.fullName.trim().charAt(0).toUpperCase()}
                              </div>
                              <span className="user-name-text">{emp.fullName}</span>
                            </div>
                          </td>
                          <td>
                            <code className="email-code">{emp.email}</code>
                          </td>
                          <td>
                            <span className="date-text">
                              {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className="role-tag">enterprise_employee</span>
                          </td>
                          <td>
                            {emp.status === 'authorized' && (
                              <span className="status-badge-table badge-green">
                                <UserCheck size={12} />
                                <span>Autorizado</span>
                              </span>
                            )}
                            {emp.status === 'pending' && (
                              <span className="status-badge-table badge-yellow">
                                <Clock size={12} />
                                <span>Pendiente</span>
                              </span>
                            )}
                            {emp.status === 'revoked' && (
                              <span className="status-badge-table badge-red">
                                <UserX size={12} />
                                <span>Revocado</span>
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="action-buttons-cell">
                              {emp.status !== 'authorized' ? (
                                <button
                                  type="button"
                                  className="btn-table-action btn-authorize"
                                  onClick={() => handleAuthorize(emp)}
                                  title={`Autorizar acceso a ${emp.fullName}`}
                                >
                                  <UserCheck size={13} />
                                  <span>Autorizar</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-table-action btn-revoke"
                                  onClick={() => setConfirmRevokeModal(emp)}
                                  title={`Revocar acceso a ${emp.fullName}`}
                                >
                                  <UserX size={13} />
                                  <span>Revocar</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CORPORATE DOCS */}
          {activeTab === 'docs' && (
            <div className="tab-pane-fade">
              <div className="docs-intro-banner">
                <ShieldCheck size={20} color="#06B6D4" />
                <div>
                  <strong>Repositorio Corporativo Clasificado &middot; NEXORA</strong>
                  <p>
                    Este contenido está protegido por el sistema de autorización RBAC. Solo usuarios con rol activo y autorización vigente pueden acceder a estos archivos.
                  </p>
                </div>
              </div>

              <div className="docs-grid">
                {docs.map((doc) => (
                  <div key={doc.id} className="doc-card">
                    <div className="doc-card-top">
                      <span className="doc-category-badge">{doc.category}</span>
                      <span className="doc-classification-tag">{doc.classification}</span>
                    </div>

                    <h3 className="doc-title">{doc.title}</h3>
                    <p className="doc-summary">{doc.summary}</p>

                    <div className="doc-meta-row">
                      <span>Versión: <strong>{doc.version}</strong></span>
                      <span>Tamaño: <strong>{doc.size}</strong></span>
                      <span>Autor: <strong>{doc.author}</strong></span>
                    </div>

                    <div className="doc-actions-row">
                      <button
                        type="button"
                        className="btn-doc-preview"
                        onClick={() => setPreviewDocModal(doc)}
                      >
                        <Eye size={14} />
                        <span>Vista previa</span>
                      </button>
                      <button
                        type="button"
                        className="btn-doc-download"
                        onClick={() => {
                          if (onShowToast) {
                            onShowToast({
                              title: 'Descarga de documento',
                              message: `Archivo "${doc.title}" descargado en modo simulación segura.`,
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
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="tab-pane-fade">
              <div className="audit-header-banner">
                <Activity size={20} color="#06B6D4" />
                <div>
                  <strong>Registro de Auditoría y Trazabilidad en Tiempo Real</strong>
                  <p>
                    Todos los cambios de permisos, autorizaciones concedidas, revocaciones de credenciales y registros de personal son persistidos automáticamente en localStorage.
                  </p>
                </div>
              </div>

              <div className="audit-full-table-card">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Fecha &amp; Hora</th>
                      <th>Evento / Acción</th>
                      <th>Detalle de la Operación</th>
                      <th>Responsable (Actor)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="table-data-row">
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="date-text">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span className={`audit-event-pill ${log.action.includes('REVOCADA') ? 'pill-red' : 'pill-cyan'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td>
                          <span className="log-detail-text">{log.details}</span>
                        </td>
                        <td>
                          <code className="email-code">{log.actor}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="tab-pane-fade">
              <div className="settings-cards-col">
                <div className="settings-card">
                  <h3>Identidad Corporativa</h3>
                  <p className="settings-desc">Parámetros organizacionales de la empresa de demostración.</p>
                  <div className="settings-grid-rows">
                    <div className="settings-row">
                      <span className="settings-label">Nombre de Empresa:</span>
                      <span className="settings-value">NEXORA Corporation</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Dominio Autorizado:</span>
                      <span className="settings-value">@nexora.demo</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Administrador Maestro:</span>
                      <span className="settings-value">admin@nexora.demo (Fijo de fábrica)</span>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>Políticas de Seguridad RBAC</h3>
                  <p className="settings-desc">Configuraciones de control de accesos y revocación.</p>
                  <div className="settings-grid-rows">
                    <div className="settings-row">
                      <span className="settings-label">Aprobación Obligatoria:</span>
                      <span className="settings-badge-ok">Activa (Previene accesos no verificados)</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Revocación en Tiempo Real:</span>
                      <span className="settings-badge-ok">Habilitada (Corte de sesión inmediato)</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Aislamiento de Cuentas:</span>
                      <span className="settings-badge-ok">Separado de PERSONAL individual</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal: Revoke Employee */}
      {confirmRevokeModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="enterprise-modal-sheet">
            <div className="enterprise-modal-header">
              <div className="modal-icon-danger">
                <ShieldAlert size={24} color="#EF4444" />
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setConfirmRevokeModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="enterprise-modal-body">
              <h3 className="modal-title-danger">Confirmar revocación de acceso</h3>
              <p className="modal-text">
                ¿Estás seguro de que deseás revocar la autorización de acceso a{' '}
                <strong>{confirmRevokeModal.fullName}</strong> ({confirmRevokeModal.email})?
              </p>
              <div className="modal-warning-box">
                <AlertCircle size={16} />
                <span>
                  El empleado perderá inmediatamente el acceso al portal corporativo y a los documentos privados. Su cuenta se mantendrá en estado <code>revoked</code>.
                </span>
              </div>
            </div>

            <div className="enterprise-modal-actions">
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={handleConfirmRevoke}
              >
                Revocar acceso inmediatamente
              </button>
              <button
                type="button"
                className="btn-secondary-cancel"
                onClick={() => setConfirmRevokeModal(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal: Document Details */}
      {previewDocModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="enterprise-modal-sheet">
            <div className="enterprise-modal-header">
              <div className="modal-icon-cyan">
                <FileText size={22} color="#06B6D4" />
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPreviewDocModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="enterprise-modal-body">
              <span className="doc-classification-tag" style={{ marginBottom: '8px', display: 'inline-block' }}>
                {previewDocModal.classification}
              </span>
              <h3 className="modal-title-doc">{previewDocModal.title}</h3>
              <p className="modal-text">{previewDocModal.summary}</p>

              <div className="doc-full-meta-card">
                <div className="doc-meta-item">
                  <span className="meta-k">Categoría:</span>
                  <span className="meta-v">{previewDocModal.category}</span>
                </div>
                <div className="doc-meta-item">
                  <span className="meta-k">Versión:</span>
                  <span className="meta-v">{previewDocModal.version}</span>
                </div>
                <div className="doc-meta-item">
                  <span className="meta-k">Última actualización:</span>
                  <span className="meta-v">{previewDocModal.updatedAt}</span>
                </div>
                <div className="doc-meta-item">
                  <span className="meta-k">Departamento:</span>
                  <span className="meta-v">{previewDocModal.author}</span>
                </div>
              </div>
            </div>

            <div className="enterprise-modal-actions">
              <button
                type="button"
                className="btn-primary-cyan"
                onClick={() => {
                  setPreviewDocModal(null)
                  if (onShowToast) {
                    onShowToast({
                      title: 'Descarga simulada',
                      message: `Descargando "${previewDocModal.title}"...`,
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
                onClick={() => setPreviewDocModal(null)}
              >
                Cerrar vista previa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

