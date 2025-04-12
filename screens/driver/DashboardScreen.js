import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const DriverDashboardScreen = ({
  navigation,
  user_id,
  user_firstname,
  user_lastname,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Active Tickets', {
            user_id,
            user_firstname,
            user_lastname,
          });
        }}>
        <Text style={styles.buttonText}>View Active Tickets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('File Disputes', {
            user_id,
            user_firstname,
            user_lastname,
          });
        }}>
        <Text style={styles.buttonText}>File a Dispute</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('My Disputes', {
            user_id,
            user_firstname,
            user_lastname,
          });
        }}>
        <Text style={styles.buttonText}>Go to My Disputes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Profile', {
            user_id,
            user_firstname,
            user_lastname,
          });
        }}>
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
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#A9A9A9',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6E7C87',
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DriverDashboardScreen;
