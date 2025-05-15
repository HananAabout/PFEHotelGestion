import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import roomService from '../../services/roomService';

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    categorie: 'simple',
    prix: '',
    statut: 'disponible'
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRoom) {
        await roomService.updateRoom(selectedRoom.id, formData);
      } else {
        await roomService.createRoom(formData);
      }
      setShowModal(false);
      fetchRooms();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la chambre:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      try {
        await roomService.deleteRoom(id);
        fetchRooms();
      } catch (error) {
        console.error('Erreur lors de la suppression de la chambre:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      numero: '',
      categorie: 'simple',
      prix: '',
      statut: 'disponible'
    });
    setSelectedRoom(null);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setFormData({
      numero: room.numero,
      categorie: room.categorie,
      prix: room.prix,
      statut: room.statut
    });
    setShowModal(true);
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Gestion des Chambres</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Ajouter une Chambre
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.numero}</td>
                  <td>{room.categorie}</td>
                  <td>{room.prix} €</td>
                  <td>{room.statut}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(room)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(room.id)}
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
            {selectedRoom ? 'Modifier la Chambre' : 'Ajouter une Chambre'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Numéro de chambre</Form.Label>
              <Form.Control
                type="text"
                value={formData.numero}
                onChange={(e) =>
                  setFormData({ ...formData, numero: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Catégorie</Form.Label>
              <Form.Select
                value={formData.categorie}
                onChange={(e) =>
                  setFormData({ ...formData, categorie: e.target.value })
                }
              >
                <option value="simple">Simple</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="luxe">Luxe</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prix par nuit (€)</Form.Label>
              <Form.Control
                type="number"
                value={formData.prix}
                onChange={(e) =>
                  setFormData({ ...formData, prix: e.target.value })
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
                <option value="disponible">Disponible</option>
                <option value="reservee">Réservée</option>
                <option value="occupee">Occupée</option>
                <option value="nettoyage">En nettoyage</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedRoom ? 'Modifier' : 'Ajouter'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default RoomManagement; 