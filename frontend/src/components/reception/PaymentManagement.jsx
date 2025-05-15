import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paymentService from '../../services/paymentService';

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    reservationId: '',
    amount: '',
    paymentMethod: 'CASH',
    status: 'PENDING'
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentService.getAllPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
    }
  };

  const handleShowModal = (payment = null) => {
    if (payment) {
      setSelectedPayment(payment);
      setFormData({
        reservationId: payment.reservationId,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        status: payment.status
      });
    } else {
      setSelectedPayment(null);
      setFormData({
        reservationId: '',
        amount: '',
        paymentMethod: 'CASH',
        status: 'PENDING'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPayment) {
        await paymentService.updatePayment(selectedPayment.id, formData);
      } else {
        await paymentService.createPayment(formData);
      }
      handleCloseModal();
      fetchPayments();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'En attente' },
      COMPLETED: { variant: 'success', text: 'Complété' },
      FAILED: { variant: 'danger', text: 'Échoué' },
      REFUNDED: { variant: 'info', text: 'Remboursé' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      CASH: 'Espèces',
      CREDIT_CARD: 'Carte de crédit',
      BANK_TRANSFER: 'Virement bancaire'
    };
    return methods[method] || method;
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Paiements</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Nouveau Paiement
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Réservation</th>
            <th>Montant</th>
            <th>Méthode de Paiement</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.reservationId}</td>
              <td>{payment.amount} €</td>
              <td>{getPaymentMethodText(payment.paymentMethod)}</td>
              <td>{getStatusBadge(payment.status)}</td>
              <td>{payment.date}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(payment)}
                >
                  Modifier
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPayment ? 'Modifier le Paiement' : 'Nouveau Paiement'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ID Réservation</Form.Label>
              <Form.Control
                type="text"
                name="reservationId"
                value={formData.reservationId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Montant</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Méthode de Paiement</Form.Label>
              <Form.Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="CASH">Espèces</option>
                <option value="CREDIT_CARD">Carte de crédit</option>
                <option value="BANK_TRANSFER">Virement bancaire</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="PENDING">En attente</option>
                <option value="COMPLETED">Complété</option>
                <option value="FAILED">Échoué</option>
                <option value="REFUNDED">Remboursé</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                {selectedPayment ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default PaymentManagement; 