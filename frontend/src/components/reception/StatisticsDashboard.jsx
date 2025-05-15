import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function StatisticsDashboard() {
  const [statistics, setStatistics] = useState({
    totalReservations: 0,
    totalRevenue: 0,
    averageStayDuration: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // TODO: Implémenter l'appel API pour récupérer les statistiques
      const mockStatistics = {
        totalReservations: 150,
        totalRevenue: 25000,
        averageStayDuration: 3.5,
        occupancyRate: 75
      };
      setStatistics(mockStatistics);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Tableau de Bord Statistiques</h2>
      
      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Réservations Total</Card.Title>
              <Card.Text className="display-4">
                {statistics.totalReservations}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Revenu Total</Card.Title>
              <Card.Text className="display-4">
                {statistics.totalRevenue.toLocaleString()} €
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Durée Moyenne de Séjour</Card.Title>
              <Card.Text className="display-4">
                {statistics.averageStayDuration} jours
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Taux d'Occupation</Card.Title>
              <Card.Text className="display-4">
                {statistics.occupancyRate}%
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default StatisticsDashboard; 