import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../../config.js';

const DisputeScreen = ({user_id}) => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDisputeSubmit = async () => {
    if (!ticketNumber || !disputeReason) {
      alert('Please provide both ticket number and dispute reason');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ticket: ticketNumber,
        filed_by: user_id,
        reason: disputeReason,
      };

      console.log('Data being submitted:', data);

      const response = await axios.post(
        `${BASE_URL}/api/submit_dispute/`,
        data,
      );

      if (response.status === 201) {
        Alert.alert(
          'Dispute Submitted',
          response.data.message ||
            'Your dispute has been submitted for review.',
          [{text: 'OK'}],
        );

        setTicketNumber('');
        setDisputeReason('');
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.error || 'An unexpected error occurred.';
        Alert.alert('Error', errorMessage, [{text: 'OK'}]);
      } else {
        Alert.alert(
          'Error',
          'There was an issue submitting your dispute. Please try again later.',
          [{text: 'OK'}],
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File a Dispute</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Ticket Number"
        placeholderTextColor="grey"
        value={ticketNumber}
        onChangeText={setTicketNumber}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Reason for Dispute"
        placeholderTextColor="grey"
        value={disputeReason}
        onChangeText={setDisputeReason}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleDisputeSubmit}
        disabled={loading}>
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'SUBMIT DISPUTE'}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#2F3A4C',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#6E7C87',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 15,
  },
  submitButtonText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DisputeScreen;
