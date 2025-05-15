// DashboardPage.jsx
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

// Styles CSS
const styles = `
.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.sidebar-item.active {
  border-left: 3px solid white;
}
.sidebar-item i {
  font-size: 1.2rem;
}
.sidebar.collapsed .sidebar-item {
  text-align: center;
  padding: 15px 0;
}
@media (max-width: 991px) {
  .main-content {
    margin-left: 0 !important;
    width: 100% !important;
  }
}
`;

function DashboardPage() {
  // État pour le contrôle du menu sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 992);

  // Données pour les graphiques
  const occupancyData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Taux d\'occupation (%)',
        data: [65, 70, 80, 85, 75, 90, 95, 98, 85, 75, 70, 80],
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Revenus (milliers €)',
        data: [45, 55, 60, 65, 70, 90, 105, 110, 80, 70, 65, 75],
        backgroundColor: '#28a745',
      }
    ]
  };

  const roomTypeData = {
    labels: ['Standard', 'Supérieure', 'Deluxe', 'Suite'],
    datasets: [
      {
        data: [35, 25, 25, 15],
        backgroundColor: [
          '#4a90e2',
          '#28a745',
          '#ffc107',
          '#dc3545'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Réactive la vérification de la largeur de l'écran
  useEffect(() => {
    // Injection du style CSS dans le document
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    const handleResize = () => {
      setSmallScreen(window.innerWidth < 992);
      if (window.innerWidth < 992) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(styleElement);
    };
  }, []);

  // Liste des éléments du menu
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'bi-speedometer2' },
    { id: 'reservations', label: 'Réservations', icon: 'bi-calendar-check' },
    { id: 'clients', label: 'Clients', icon: 'bi-people' },
    { id: 'chambres', label: 'Chambres', icon: 'bi-door-closed' },
    { id: 'services', label: 'Services', icon: 'bi-concierge-bell' },
    { id: 'personnel', label: 'Personnel', icon: 'bi-person-badge' },
    { id: 'paiements', label: 'Paiements', icon: 'bi-credit-card' },
    { id: 'rapports', label: 'Rapports', icon: 'bi-file-earmark-bar-graph' },
    { id: 'parametres', label: 'Paramètres', icon: 'bi-gear' },
  ];

  // Données simulées pour les KPIs
  const kpis = [
    { label: 'Taux d\'occupation', value: '85%', icon: 'bi-building', color: 'primary' },
    { label: 'Réservations', value: '24', icon: 'bi-calendar-check', color: 'success' },
    { label: 'Revenu quotidien', value: '3,250€', icon: 'bi-cash-stack', color: 'info' },
    { label: 'Clients présents', value: '42', icon: 'bi-people', color: 'warning' },
  ];

  // Données simulées pour les alertes
  const alerts = [
    { id: 1, type: 'warning', message: '5 chambres à nettoyer avant 14h00', icon: 'bi-brush' },
    { id: 2, type: 'info', message: '3 arrivées prévues aujourd\'hui', icon: 'bi-box-arrow-in-right' },
    { id: 3, type: 'danger', message: '2 clients en attente à la réception', icon: 'bi-clock-history' },
    { id: 4, type: 'success', message: 'Maintenance terminée pour les chambres 201-205', icon: 'bi-check-circle' },
  ];

  // Données simulées pour les tâches
  const tasks = [
    { id: 1, task: 'Préparer les chambres VIP 301, 302', deadline: 'Aujourd\'hui, 12:00', progress: 75 },
    { id: 2, task: 'Réapprovisionner le mini-bar chambres 101-110', deadline: 'Aujourd\'hui, 15:00', progress: 30 },
    { id: 3, task: 'Vérifier les réservations du weekend', deadline: 'Demain, 10:00', progress: 0 },
    { id: 4, task: 'Réunion d\'équipe personnel d\'entretien', deadline: 'Demain, 09:00', progress: 50 },
  ];

  // Données simulées pour les réservations récentes
  const recentBookings = [
    { id: 'RES-5421', client: 'Martin Dupont', chambre: '301 - Suite', arrivee: '12/04/2025', depart: '15/04/2025', statut: 'Confirmée' },
    { id: 'RES-5420', client: 'Jeanne Martin', chambre: '205 - Deluxe', arrivee: '12/04/2025', depart: '14/04/2025', statut: 'Check-in' },
    { id: 'RES-5419', client: 'Paul Lefebvre', chambre: '118 - Standard', arrivee: '11/04/2025', depart: '16/04/2025', statut: 'En cours' },
    { id: 'RES-5418', client: 'Sophie Girard', chambre: '210 - Supérieure', arrivee: '10/04/2025', depart: '12/04/2025', statut: 'Check-out' },
  ];

  // Options pour les graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className="d-flex">
      {/* Sidebar Navigation */}
      <div 
        className={`sidebar bg-dark text-white ${sidebarCollapsed ? 'collapsed' : ''}`} 
        style={{
          width: sidebarCollapsed ? '70px' : '250px',
          minHeight: '100vh',
          position: 'fixed',
          zIndex: 100,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          left: smallScreen && sidebarCollapsed ? '-70px' : '0',
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
          {!sidebarCollapsed && (
            <div className="logo">
              <span className="h4 text-white">HotelManager</span>
            </div>
          )}
          <button 
            className="btn btn-outline-secondary border-0" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </button>
        </div>
        <div className="mt-2">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`p-3 sidebar-item ${activeMenu === item.id ? 'active bg-primary' : ''}`}
              style={{ 
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setActiveMenu(item.id)}
            >
              <i className={`bi ${item.icon} me-${sidebarCollapsed ? '0' : '3'}`}></i>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
          ))}
        </div>
        <div className="mt-auto p-3 border-top border-secondary">
          <div 
            className="d-flex align-items-center" 
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="bg-secondary rounded-circle me-2 d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-person-fill text-white"></i>
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="text-white">Admin User</div>
                <small className="text-muted">Déconnexion</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="main-content" 
        style={{ 
          marginLeft: smallScreen && sidebarCollapsed ? '0' : (sidebarCollapsed ? '70px' : '250px'),
          width: smallScreen && sidebarCollapsed ? '100%' : `calc(100% - ${sidebarCollapsed ? '70px' : '250px'})`,
          transition: 'margin-left 0.3s ease, width 0.3s ease',
        }}
      >
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center py-3">
              <div>
                {smallScreen && (
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    <i className="bi bi-list"></i>
                  </button>
                )}
                <h4 className="m-0">Tableau de bord</h4>
              </div>
              <div className="d-flex align-items-center">
                <div className="position-relative me-3">
                  <i className="bi bi-bell fs-5" style={{ cursor: 'pointer' }}></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                  </span>
                </div>
                <div className="position-relative me-3">
                  <i className="bi bi-envelope fs-5" style={{ cursor: 'pointer' }}></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                    5
                  </span>
                </div>
                <div className="dropdown">
                  <div className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                    <div 
                      className="bg-primary rounded-circle me-2 d-flex align-items-center justify-content-center text-white"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <span>Admin</span>
                    <i className="bi bi-chevron-down ms-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="container-fluid py-4">
          {/* KPI Cards */}
          <div className="row">
            {kpis.map((kpi, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className={`bg-${kpi.color} bg-opacity-10 rounded p-3 me-3`}>
                        <i className={`bi ${kpi.icon} fs-4 text-${kpi.color}`}></i>
                      </div>
                      <div>
                        <h6 className="mb-1 text-muted">{kpi.label}</h6>
                        <h3 className="mb-0">{kpi.value}</h3>
                      </div>
                    </div>
                    <div className="progress" style={{ height: '5px' }}>
                      <div 
                        className={`progress-bar bg-${kpi.color}`} 
                        style={{ width: '70%' }} 
                      ></div>
                    </div>
                    <small className="d-block mt-2 text-success">
                      <i className="bi bi-arrow-up me-1"></i>
                      5% d'augmentation cette semaine
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="row mb-4">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Taux d'occupation</h5>
                </div>
                <div className="card-body">
                  <div style={{ height: '300px' }}>
                    <Line data={occupancyData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Répartition des chambres</h5>
                </div>
                <div className="card-body d-flex align-items-center">
                  <div style={{ height: '300px', width: '100%' }}>
                    <Doughnut data={roomTypeData} options={doughnutOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Revenus mensuels</h5>
                </div>
                <div className="card-body">
                  <div style={{ height: '300px' }}>
                    <Bar data={revenueData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title m-0">Alertes</h5>
                  <span className="badge bg-primary rounded-pill">{alerts.length}</span>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {alerts.map(alert => (
                      <div key={alert.id} className="list-group-item border-start-0 border-end-0">
                        <div className="d-flex align-items-center">
                          <div className={`bg-${alert.type} bg-opacity-10 rounded p-2 me-3`}>
                            <i className={`bi ${alert.icon} text-${alert.type}`}></i>
                          </div>
                          <div>
                            <p className="mb-0">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title m-0">Tâches à accomplir</h5>
                  <button className="btn btn-sm btn-primary">
                    <i className="bi bi-plus-circle me-1"></i>Nouvelle tâche
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {tasks.map(task => (
                      <div key={task.id} className="list-group-item border-start-0 border-end-0">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>{task.task}</strong>
                          <span className="badge bg-info">{task.deadline}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{ width: `${task.progress}%` }} 
                            ></div>
                          </div>
                          <span className="text-muted small">{task.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title m-0">Réservations récentes</h5>
                  <button className="btn btn-sm btn-outline-primary">
                    Voir toutes
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Client</th>
                          <th>Chambre</th>
                          <th>Arrivée</th>
                          <th>Départ</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map(booking => (
                          <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.client}</td>
                            <td>{booking.chambre}</td>
                            <td>{booking.arrivee}</td>
                            <td>{booking.depart}</td>
                            <td>
                              <span className={`badge bg-${
                                booking.statut === 'Confirmée' ? 'primary' : 
                                booking.statut === 'Check-in' ? 'success' : 
                                booking.statut === 'En cours' ? 'info' : 'warning'
                              }`}>
                                {booking.statut}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white py-3 border-top mt-4">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 text-muted">© 2025 HotelManager, Tous droits réservés</p>
              <div>
                <a href="#" className="text-muted me-3">Aide</a>
                <a href="#" className="text-muted me-3">Confidentialité</a>
                <a href="#" className="text-muted">Conditions</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DashboardPage;