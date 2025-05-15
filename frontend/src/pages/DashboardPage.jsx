import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function DashboardPage() {
  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Tableau de Bord</h1>
      
      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Mes Réservations</Card.Title>
              <Card.Text>
                Consultez et gérez vos réservations actuelles et passées.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Mon Profil</Card.Title>
              <Card.Text>
                Gérez vos informations personnelles et vos préférences.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Historique des Paiements</Card.Title>
              <Card.Text>
                Consultez l'historique de vos paiements et factures.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardPage; 