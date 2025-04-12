import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import axios from 'axios';
import BASE_URL from '../../config.js';

const ActiveTicketsScreen = ({user_id}) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const fetchActiveTickets = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/active_tickets/${user_id}/`,
      );
      console.log('Fetched tickets:', response.data);
      if (response.data && response.data.active_tickets) {
        setTickets(response.data.active_tickets);
      }
    } catch (error) {
      console.error('Error fetching active tickets:', error);
    }
  };

  useEffect(() => {
    fetchActiveTickets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Active Tickets</Text>
      {Array.isArray(tickets) && tickets.length > 0 ? (
        tickets.map(ticket => (
          <TouchableOpacity
            key={ticket.id}
            style={styles.ticket}
            onPress={() => setSelectedTicket(ticket)}>
            <Text style={styles.ticketText}>
              Ticket Number: {ticket.id} {'\n'}
              Violation: {ticket.violation}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noTicketsText}>No active tickets available.</Text>
      )}

      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedTicket && (
              <>
                <Text style={styles.modalTitle}>
                  Ticket Details for Plate {selectedTicket.plate_number}
                </Text>
                <Text style={styles.modalText}>
                  Violation: {selectedTicket.violation}
                </Text>
                <Text style={styles.modalText}>
                  Fine: {selectedTicket.fine_amount}
                </Text>
                <Text style={styles.modalText}>
                  Created At:{' '}
                  {new Date(selectedTicket.created_at).toLocaleString()}
                </Text>
                <Text style={styles.modalText}>
                  Due Date: {new Date(selectedTicket.due_date).toLocaleString()}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedTicket(null)}>
                  <Text style={styles.closeButtonText}>CLOSE</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F3A4C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#A9A9A9',
    marginBottom: 20,
  },
  ticket: {
    width: '80%',
    padding: 15,
    backgroundColor: '#6E7C87',
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  ticketText: {
    color: '#F0F0F0',
    fontSize: 16,
  },
  noTicketsText: {
    color: '#F0F0F0',
    fontSize: 16,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#F0F0F0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#2F3A4C',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#2F3A4C',
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6E7C87',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ActiveTicketsScreen;
