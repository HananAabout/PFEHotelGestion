import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Card } from 'react-bootstrap';
import reservationService from '../../services/reservationService';
import roomService from '../../services/roomService';
import clientService from '../../services/clientService';

function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [formData, setFormData] = useState({
    clientId: '',
    chambreId: '',
    dateArrivee: '',
    dateDepart: '',
    statut: 'en_attente'
  });

  useEffect(() => {
    fetchReservations();
    fetchRooms();
    fetchClients();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await reservationService.getAllReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des chambres:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientService.getAllClients();
      setClients(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedReservation) {
        await reservationService.updateReservation(selectedReservation.id, formData);
      } else {
        await reservationService.createReservation(formData);
      }
      setShowModal(false);
      fetchReservations();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la réservation:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        await reservationService.deleteReservation(id);
        fetchReservations();
      } catch (error) {
        console.error('Erreur lors de la suppression de la réservation:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      chambreId: '',
      dateArrivee: '',
      dateDepart: '',
      statut: 'en_attente'
    });
    setSelectedReservation(null);
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setFormData({
      clientId: reservation.clientId,
      chambreId: reservation.chambreId,
      dateArrivee: reservation.dateArrivee,
      dateDepart: reservation.dateDepart,
      statut: reservation.statut
    });
    setShowModal(true);
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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Client</th>
                <th>Chambre</th>
                <th>Date d'arrivée</th>
                <th>Date de départ</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.client?.nom} {reservation.client?.prenom}</td>
                  <td>Chambre {reservation.chambre?.numero}</td>
                  <td>{new Date(reservation.dateArrivee).toLocaleDateString()}</td>
                  <td>{new Date(reservation.dateDepart).toLocaleDateString()}</td>
                  <td>{reservation.statut}</td>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
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
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
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
                value={formData.chambreId}
                onChange={(e) =>
                  setFormData({ ...formData, chambreId: e.target.value })
                }
                required
              >
                <option value="">Sélectionner une chambre</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Chambre {room.numero} - {room.categorie} ({room.prix}€/nuit)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date d'arrivée</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateArrivee}
                onChange={(e) =>
                  setFormData({ ...formData, dateArrivee: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de départ</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateDepart}
                onChange={(e) =>
                  setFormData({ ...formData, dateDepart: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select
                value={formData.statut}
                onChange={(e) =>
                  setFormData({ ...formData, statut: e.target.value })
                }
              >
                <option value="en_attente">En attente</option>
                <option value="confirmee">Confirmée</option>
                <option value="annulee">Annulée</option>
                <option value="terminee">Terminée</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedReservation ? 'Modifier' : 'Créer'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ReservationManagement; 