import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import BASE_URL from '../../config.js';

const DashboardScreen = ({
  navigation,
  user_id,
  user_firstname,
  user_lastname,
}) => {
  const [stats, setStats] = useState({
    total_tickets: 0,
    pending_tickets: 0,
    resolved_disputes: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const updateStatsAndActivity = () => {
    axios
      .get(`${BASE_URL}/api/get_ticketsByPoliceCounts/${user_id}/`)
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch ticket counts.');
      });

    // Fetch recent activity
    axios
      .get(`${BASE_URL}/api/get_recent_activity/${user_id}/`)
      .then(response => {
        setRecentActivity(response.data);
      })
      .catch(error => {});
  };

  useEffect(() => {
    updateStatsAndActivity();
  }, [user_id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Police Dashboard</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.total_tickets}</Text>
          <Text style={styles.statLabel}>Total Tickets</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.pending_tickets}</Text>
          <Text style={styles.statLabel}>Pending Tickets</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.resolved_disputes}</Text>
          <Text style={styles.statLabel}>Resolved Disputes</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          navigation.navigate('Add Ticket', {
            user_id,
            user_firstname,
            user_lastname,
            updateStatsAndActivity,
          });
        }}>
        <Text style={styles.buttonText}>Add a New Ticket</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={updateStatsAndActivity}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Search Tickets')}>
        <Text style={styles.buttonText}>Search Ticket</Text>
      </TouchableOpacity>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityContainer}>
        {recentActivity.length > 0 ? (
          recentActivity.map((activity, index) => (
            <Text key={index} style={styles.activityItem}>
              {activity.description ||
                `Ticket ID: ${activity.ticket_id} - Fine: ${activity.fine_amount}`}
            </Text>
          ))
        ) : (
          <Text style={styles.activityItem}>No recent activity available.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() =>
          navigation.navigate('Profile', {
            user_id: user_id,
            user_firstname: user_firstname,
            user_lastname: user_lastname,
          })
        }>
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F3A4C',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#A9A9A9',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#4C5C6E',
    padding: 15,
    borderRadius: 10,
    width: '31%',
    display: 'flex',
    flexDirection: 'row'
  },
  statNumber: {
    width: '20%',
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    display: 'flex',
    textAlign: 'center',
    fontSize: 12,
    color: '#A9A9A9',
    width: '80%'
  },
  sectionTitle: {
    fontSize: 18,
    color: '#A9A9A9',
    marginBottom: 10,
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#6E7C87',
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  activityContainer: {
    width: '80%',
    backgroundColor: '#4C5C6E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  activityItem: {
    fontSize: 14,
    color: '#F0F0F0',
    marginBottom: 5,
  },
  profileButton: {
    backgroundColor: '#4C5C6E',
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 15,
  },
  refreshButton: {
    backgroundColor: '#6E7C87',
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default DashboardScreen;
