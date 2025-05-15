import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Card } from 'react-bootstrap';
import userService from '../../services/userService';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'receptionniste',
    mot_de_passe: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, formData);
      } else {
        await userService.createUser(formData);
      }
      setShowModal(false);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      role: 'receptionniste',
      mot_de_passe: ''
    });
    setSelectedUser(null);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      mot_de_passe: '' // Ne pas afficher le mot de passe existant
    });
    setShowModal(true);
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Gestion des Utilisateurs</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Nouvel Utilisateur
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
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
            {selectedUser ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
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
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="admin">Administrateur</option>
                <option value="receptionniste">Réceptionniste</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={formData.mot_de_passe}
                onChange={(e) =>
                  setFormData({ ...formData, mot_de_passe: e.target.value })
                }
                required={!selectedUser}
                placeholder={selectedUser ? "Laisser vide pour ne pas modifier" : ""}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedUser ? 'Modifier' : 'Créer'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserManagement; 