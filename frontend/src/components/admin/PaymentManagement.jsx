import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import paymentService from '../../services/paymentService';
import reservationService from '../../services/reservationService';

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    reservationId: '',
    montant: '',
    methode: 'especes',
    type: 'total'
  });

  useEffect(() => {
    fetchPayments();
    fetchReservations();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentService.getAllPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await reservationService.getAllReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPayment) {
        await paymentService.updatePayment(selectedPayment.id, formData);
      } else {
        await paymentService.createPayment(formData);
      }
      setShowModal(false);
      fetchPayments();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du paiement:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      try {
        await paymentService.deletePayment(id);
        fetchPayments();
      } catch (error) {
        console.error('Erreur lors de la suppression du paiement:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      reservationId: '',
      montant: '',
      methode: 'especes',
      type: 'total'
    });
    setSelectedPayment(null);
  };

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setFormData({
      reservationId: payment.reservationId,
      montant: payment.montant,
      methode: payment.methode,
      type: payment.type
    });
    setShowModal(true);
  };

  const generateReceipt = async (paymentId) => {
    try {
      const response = await paymentService.generateReceipt(paymentId);
      // Créer un lien de téléchargement pour le PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recu-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors de la génération du reçu:', error);
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Gestion des Paiements</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Nouveau Paiement
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Réservation</th>
                <th>Montant</th>
                <th>Méthode</th>
                <th>Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    Réservation #{payment.reservation?.id} - {payment.reservation?.client?.nom}
                  </td>
                  <td>{payment.montant} €</td>
                  <td>{payment.methode}</td>
                  <td>{payment.type}</td>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(payment)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => generateReceipt(payment.id)}
                    >
                      Reçu
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(payment.id)}
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
            {selectedPayment ? 'Modifier le Paiement' : 'Nouveau Paiement'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Réservation</Form.Label>
              <Form.Select
                value={formData.reservationId}
                onChange={(e) =>
                  setFormData({ ...formData, reservationId: e.target.value })
                }
                required
              >
                <option value="">Sélectionner une réservation</option>
                {reservations.map((reservation) => (
                  <option key={reservation.id} value={reservation.id}>
                    #{reservation.id} - {reservation.client?.nom} {reservation.client?.prenom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Montant (€)</Form.Label>
              <Form.Control
                type="number"
                value={formData.montant}
                onChange={(e) =>
                  setFormData({ ...formData, montant: e.target.value })
                }
                required
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Méthode de paiement</Form.Label>
                  <Form.Select
                    value={formData.methode}
                    onChange={(e) =>
                      setFormData({ ...formData, methode: e.target.value })
                    }
                  >
                    <option value="especes">Espèces</option>
                    <option value="carte">Carte bancaire</option>
                    <option value="virement">Virement</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Type de paiement</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="total">Total</option>
                    <option value="acompte">Acompte</option>
                    <option value="solde">Solde</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              {selectedPayment ? 'Modifier' : 'Créer'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PaymentManagement; 