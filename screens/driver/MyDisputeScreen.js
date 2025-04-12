import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../../config.js';

const MyDisputesScreen = ({user_id}) => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch disputes function
  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/disputes/${user_id}/`);
      console.log('API Response:', response.data);
      setDisputes(response.data);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch disputes on component mount
  useEffect(() => {
    fetchDisputes();
  }, [user_id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List of Disputes</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchDisputes}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      {disputes.length > 0 ? (
        <FlatList
          data={disputes}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={({item}) =>
            item ? (
              <View style={styles.disputeCard}>
                <Text style={styles.ticket}>Ticket ID: {item.ticket}</Text>
                <Text style={styles.reason}>Reason: {item.reason}</Text>
                <Text style={styles.date}>
                  Filed On:{' '}
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : 'Unknown'}
                </Text>
              </View>
            ) : null
          }
        />
      ) : (
        <Text style={styles.noDisputes}>No disputes found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',

    padding: 16,
    backgroundColor: '#2F3A4C',
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  refreshButton: {
    backgroundColor: '#6E7C87',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 16,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disputeCard: {
    backgroundColor: '#3B4C63',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
  },
  ticket: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
  },
  reason: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  date: {
    color: '#A0AEC0',
    fontSize: 12,
    marginTop: 4,
  },
  noDisputes: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default MyDisputesScreen;
