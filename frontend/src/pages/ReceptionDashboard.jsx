import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import RoomStatus from '../components/reception/RoomStatus';
import ReservationManagement from '../components/reception/ReservationManagement';
import ClientManagement from '../components/reception/ClientManagement';
import PaymentManagement from '../components/reception/PaymentManagement';
import StatisticsDashboard from '../components/reception/StatisticsDashboard';

function ReceptionDashboard() {
  const [activeTab, setActiveTab] = useState('rooms');

  return (
    <Container fluid className="p-0">
      <Row>
        <Col md={2} className="bg-dark min-vh-100 p-3">
          <h4 className="text-white mb-4">Réception Dashboard</h4>
          <Nav className="flex-column">
            <Nav.Link 
              className={`text-white mb-2 ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              État des Chambres
            </Nav.Link>
            <Nav.Link 
              className={`text-white mb-2 ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              Gestion des Réservations
            </Nav.Link>
            <Nav.Link 
              className={`text-white mb-2 ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              Gestion des Clients
            </Nav.Link>
            <Nav.Link 
              className={`text-white mb-2 ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              Gestion des Paiements
            </Nav.Link>
            <Nav.Link 
              className={`text-white mb-2 ${activeTab === 'statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('statistics')}
            >
              Statistiques
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={10} className="p-4">
          <Tab.Content>
            <Tab.Pane active={activeTab === 'rooms'}>
              <RoomStatus />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'reservations'}>
              <ReservationManagement />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'clients'}>
              <ClientManagement />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'payments'}>
              <PaymentManagement />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'statistics'}>
              <StatisticsDashboard />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Container>
  );
}

export default ReceptionDashboard; 