import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Card, Tab, Nav } from 'react-bootstrap';
import clientService from '../../services/clientService';
import reservationService from '../../services/reservationService';

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientReservations, setClientReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cin: '',
    passport: ''
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

  const fetchClientReservations = async (clientId) => {
    try {
      const response = await reservationService.getClientReservations(clientId);
      setClientReservations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
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
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      cin: '',
      passport: ''
    });
    setSelectedClient(null);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setFormData({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      cin: client.cin,
      passport: client.passport
    });
    setShowModal(true);
  };

  const handleViewReservations = (client) => {
    setSelectedClient(client);
    fetchClientReservations(client.id);
    setActiveTab('reservations');
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
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="list">Liste des Clients</Nav.Link>
              </Nav.Item>
              {selectedClient && (
                <Nav.Item>
                  <Nav.Link eventKey="reservations">
                    Réservations de {selectedClient.nom} {selectedClient.prenom}
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="list">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>CIN/Passport</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td>{client.nom}</td>
                        <td>{client.prenom}</td>
                        <td>{client.email}</td>
                        <td>{client.telephone}</td>
                        <td>{client.cin || client.passport}</td>
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
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleViewReservations(client)}
                          >
                            Réservations
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
              </Tab.Pane>

              <Tab.Pane eventKey="reservations">
                {selectedClient && (
                  <div>
                    <h5 className="mb-3">
                      Historique des réservations pour {selectedClient.nom} {selectedClient.prenom}
                    </h5>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Chambre</th>
                          <th>Date d'arrivée</th>
                          <th>Date de départ</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientReservations.map((reservation) => (
                          <tr key={reservation.id}>
                            <td>Chambre {reservation.chambre?.numero}</td>
                            <td>{new Date(reservation.dateArrivee).toLocaleDateString()}</td>
                            <td>{new Date(reservation.dateDepart).toLocaleDateString()}</td>
                            <td>{reservation.statut}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
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
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="tel"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CIN</Form.Label>
              <Form.Control
                type="text"
                value={formData.cin}
                onChange={(e) =>
                  setFormData({ ...formData, cin: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Passport</Form.Label>
              <Form.Control
                type="text"
                value={formData.passport}
                onChange={(e) =>
                  setFormData({ ...formData, passport: e.target.value })
                }
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedClient ? 'Modifier' : 'Créer'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ClientManagement; 