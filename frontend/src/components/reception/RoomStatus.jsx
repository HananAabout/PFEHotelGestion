import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import roomService from '../../services/roomService';

function RoomStatus() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des chambres:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'disponible':
        return <Badge bg="success">Disponible</Badge>;
      case 'occupee':
        return <Badge bg="danger">Occupée</Badge>;
      case 'reservee':
        return <Badge bg="warning" text="dark">Réservée</Badge>;
      case 'nettoyage':
        return <Badge bg="info">En nettoyage</Badge>;
      default:
        return <Badge bg="secondary">Inconnu</Badge>;
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.statut === filter;
  });

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>État des Chambres</h4>
          <div>
            <Button
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setFilter('all')}
            >
              Toutes
            </Button>
            <Button
              variant={filter === 'disponible' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setFilter('disponible')}
            >
              Disponibles
            </Button>
            <Button
              variant={filter === 'occupee' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setFilter('occupee')}
            >
              Occupées
            </Button>
            <Button
              variant={filter === 'reservee' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setFilter('reservee')}
            >
              Réservées
            </Button>
            <Button
              variant={filter === 'nettoyage' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('nettoyage')}
            >
              En nettoyage
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            {filteredRooms.map((room) => (
              <Col key={room.id} md={3} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      Chambre {room.numero}
                      {getStatusBadge(room.statut)}
                    </Card.Title>
                    <Card.Text>
                      <strong>Catégorie:</strong> {room.categorie}<br />
                      <strong>Prix:</strong> {room.prix} €/nuit
                    </Card.Text>
                    {room.statut === 'occupee' && (
                      <div className="mt-2">
                        <small className="text-muted">
                          Occupée par: {room.client?.nom} {room.client?.prenom}
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RoomStatus; 