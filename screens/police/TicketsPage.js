import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../../config.js';

const TicketsPage = ({route, user_id}) => {
  const [tickets, setTickets] = useState([]);
  const [printer, setPrinter] = useState(null);

  const fetchTickets = () => {
    axios
      .get(`${BASE_URL}/api/get_All_tickets/${user_id}/`)
      .then(response => {
        console.log(response.data);
        setTickets(response.data);
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch tickets.');
      });
  };

  //Need function to connect to thermal printer bluetooth and print the tickets

  useEffect(() => {
    fetchTickets();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.ticketContainer}>
      <Text style={styles.ticketText}>
        <Text style={styles.label}>License No:</Text> {item.license_no}
      </Text>
      <Text style={styles.ticketText}>
        <Text style={styles.label}>Plate No:</Text> {item.plate_number}
      </Text>
      <Text style={styles.ticketText}>
        <Text style={styles.label}>Violation:</Text>{' '}
        {item.violation_details.name}
      </Text>

      <Text style={styles.ticketText}>
        <Text style={styles.label}>Fine Amount:</Text> {item.fine_amount}
      </Text>
      <Text style={styles.ticketText}>
        <Text style={styles.label}>Status:</Text> {item.status}
      </Text>
      <Image
        source={{uri: item.driver_signature}}
        style={{width: 100, height: 100}}
      />

      <TouchableOpacity
        style={styles.printButton}
        onPress={() => handlePrint(item.id)}>
        <Text style={styles.buttonText}>Print</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tickets</Text>
      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tickets available.</Text>
        }
      />
      <TouchableOpacity style={styles.refreshButton} onPress={fetchTickets}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2F3A4C',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  ticketContainer: {
    backgroundColor: '#4C5C6E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  ticketText: {
    color: '#FFFFFF',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  printButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#A9A9A9',
    marginTop: 20,
  },
});

export default TicketsPage;
