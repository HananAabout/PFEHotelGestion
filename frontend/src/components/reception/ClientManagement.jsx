import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import clientService from '../../services/clientService';

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    typePieceIdentite: 'cni',
    numeroPieceIdentite: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

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
      if (selectedClient) {
        await clientService.updateClient(selectedClient.id, formData);
      } else {
        await clientService.createClient(formData);
      }
      setShowModal(false);
      fetchClients();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du client:', error);
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setFormData({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
      dateNaissance: client.dateNaissance,
      typePieceIdentite: client.typePieceIdentite,
      numeroPieceIdentite: client.numeroPieceIdentite
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientService.deleteClient(id);
        fetchClients();
      } catch (error) {
        console.error('Erreur lors de la suppression du client:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedClient(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      dateNaissance: '',
      typePieceIdentite: 'cni',
      numeroPieceIdentite: ''
    });
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Gestion des Clients</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Nouveau Client
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Type Pièce</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.nom}</td>
                  <td>{client.prenom}</td>
                  <td>{client.email}</td>
                  <td>{client.telephone}</td>
                  <td>
                    <Badge bg="info">
                      {client.typePieceIdentite.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(client)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
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
            {selectedClient ? 'Modifier le Client' : 'Nouveau Client'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de Naissance</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type de Pièce d'Identité</Form.Label>
              <Form.Select
                value={formData.typePieceIdentite}
                onChange={(e) => setFormData({ ...formData, typePieceIdentite: e.target.value })}
                required
              >
                <option value="cni">CNI</option>
                <option value="passeport">Passeport</option>
                <option value="permis">Permis de conduire</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Numéro de Pièce d'Identité</Form.Label>
              <Form.Control
                type="text"
                value={formData.numeroPieceIdentite}
                onChange={(e) => setFormData({ ...formData, numeroPieceIdentite: e.target.value })}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                {selectedClient ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ClientManagement; 