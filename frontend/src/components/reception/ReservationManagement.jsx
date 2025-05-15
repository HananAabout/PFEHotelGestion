import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import reservationService from '../../services/reservationService';
import roomService from '../../services/roomService';
import clientService from '../../services/clientService';

function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    roomId: '',
    dateDebut: '',
    dateFin: '',
    statut: 'en_attente'
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [reservationsRes, roomsRes, clientsRes] = await Promise.all([
          reservationService.getAllReservations(),
          roomService.getAllRooms(),
          clientService.getAllClients()
        ]);

        if (isMounted) {
          setReservations(reservationsRes.data);
          setRooms(roomsRes.data);
          setClients(clientsRes.data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Erreur lors du chargement des données');
          console.error('Erreur:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (selectedReservation) {
        await reservationService.updateReservation(selectedReservation.id, formData);
      } else {
        await reservationService.createReservation(formData);
      }
      setShowModal(false);
      fetchReservations();
      resetForm();
    } catch (error) {
      setError('Erreur lors de la sauvegarde de la réservation');
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setFormData({
      clientId: reservation.clientId,
      roomId: reservation.roomId,
      dateDebut: reservation.dateDebut,
      dateFin: reservation.dateFin,
      statut: reservation.statut
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        setError(null);
        await reservationService.deleteReservation(id);
        fetchReservations();
      } catch (error) {
        setError('Erreur lors de la suppression de la réservation');
        console.error('Erreur:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedReservation(null);
    setFormData({
      clientId: '',
      roomId: '',
      dateDebut: '',
      dateFin: '',
      statut: 'en_attente'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_attente':
        return <Badge bg="warning" text="dark">En attente</Badge>;
      case 'confirmee':
        return <Badge bg="success">Confirmée</Badge>;
      case 'annulee':
        return <Badge bg="danger">Annulée</Badge>;
      case 'terminee':
        return <Badge bg="info">Terminée</Badge>;
      default:
        return <Badge bg="secondary">Inconnu</Badge>;
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Gestion des Réservations</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Nouvelle Réservation
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Chambre</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.client?.nom} {reservation.client?.prenom}</td>
                  <td>Chambre {reservation.room?.numero}</td>
                  <td>{new Date(reservation.dateDebut).toLocaleDateString()}</td>
                  <td>{new Date(reservation.dateFin).toLocaleDateString()}</td>
                  <td>{getStatusBadge(reservation.statut)}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(reservation)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(reservation.id)}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedReservation ? 'Modifier la Réservation' : 'Nouvelle Réservation'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom} {client.prenom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chambre</Form.Label>
              <Form.Select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                required
              >
                <option value="">Sélectionner une chambre</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Chambre {room.numero} - {room.categorie}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de Début</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de Fin</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                required
              >
                <option value="en_attente">En attente</option>
                <option value="confirmee">Confirmée</option>
                <option value="annulee">Annulée</option>
                <option value="terminee">Terminée</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                {selectedReservation ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ReservationManagement; 