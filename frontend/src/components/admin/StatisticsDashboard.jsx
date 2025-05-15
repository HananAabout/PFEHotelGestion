import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import roomService from '../../services/roomService';
import reservationService from '../../services/reservationService';
import paymentService from '../../services/paymentService';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function StatisticsDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalReservations: 0,
    activeReservations: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{
      label: 'Revenus',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });
  const [occupancyData, setOccupancyData] = useState({
    labels: ['Disponibles', 'Occupées', 'En nettoyage'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
    }]
  });
  const [reservationData, setReservationData] = useState({
    labels: [],
    datasets: [{
      label: 'Réservations',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  });

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    try {
      // Récupérer les statistiques des chambres
      const roomsResponse = await roomService.getAllRooms();
      const rooms = roomsResponse.data;
      
      // Récupérer les réservations
      const reservationsResponse = await reservationService.getAllReservations();
      const reservations = reservationsResponse.data;
      
      // Récupérer les paiements
      const paymentsResponse = await paymentService.getPaymentStats(
        dateRange.startDate,
        dateRange.endDate
      );
      const payments = paymentsResponse.data;

      // Calculer les statistiques
      const totalRooms = rooms.length;
      const availableRooms = rooms.filter(room => room.statut === 'disponible').length;
      const occupiedRooms = rooms.filter(room => room.statut === 'occupee').length;
      const cleaningRooms = rooms.filter(room => room.statut === 'nettoyage').length;
      
      const totalReservations = reservations.length;
      const activeReservations = reservations.filter(
        res => res.statut === 'confirmee' || res.statut === 'en_attente'
      ).length;

      // Mettre à jour l'état
      setStats({
        totalRooms,
        availableRooms,
        occupiedRooms,
        totalReservations,
        activeReservations,
        totalRevenue: payments.total || 0,
        monthlyRevenue: payments.monthly || 0
      });

      // Mettre à jour les données des graphiques
      updateCharts(rooms, reservations, payments);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const updateCharts = (rooms, reservations, payments) => {
    // Graphique d'occupation des chambres
    setOccupancyData({
      labels: ['Disponibles', 'Occupées', 'En nettoyage'],
      datasets: [{
        data: [
          rooms.filter(r => r.statut === 'disponible').length,
          rooms.filter(r => r.statut === 'occupee').length,
          rooms.filter(r => r.statut === 'nettoyage').length
        ],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
      }]
    });

    // Graphique des revenus
    const revenueLabels = payments.daily?.map(p => p.date) || [];
    const revenueValues = payments.daily?.map(p => p.amount) || [];
    
    setRevenueData({
      labels: revenueLabels,
      datasets: [{
        label: 'Revenus',
        data: revenueValues,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    });

    // Graphique des réservations
    const reservationLabels = reservations.map(r => r.dateArrivee);
    const reservationCounts = reservations.reduce((acc, curr) => {
      const date = curr.dateArrivee;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    setReservationData({
      labels: Object.keys(reservationCounts),
      datasets: [{
        label: 'Réservations',
        data: Object.values(reservationCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }]
    });
  };

  return (
    <div>
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Chambres</Card.Title>
              <Card.Text>
                Total: {stats.totalRooms}<br />
                Disponibles: {stats.availableRooms}<br />
                Occupées: {stats.occupiedRooms}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Réservations</Card.Title>
              <Card.Text>
                Total: {stats.totalReservations}<br />
                Actives: {stats.activeReservations}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Revenus</Card.Title>
              <Card.Text>
                Total: {stats.totalRevenue} €<br />
                Mensuel: {stats.monthlyRevenue} €
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Période</Card.Title>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Occupation des Chambres</Card.Title>
              <Pie data={occupancyData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Revenus par Jour</Card.Title>
              <Line data={revenueData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Réservations par Date</Card.Title>
              <Bar data={reservationData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default StatisticsDashboard; 