import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../../config';

const ProfileScreen = ({navigation, route, user_id}) => {
  const {user_role} = route.params;
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    mobile_number: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/user_profile/${user_id}/`,
        );
        setFormData({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          mobile_number: response.data.mobile_number,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
      }
    };

    fetchProfile();
  }, [user_id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/user_profile/${user_id}/`,
        formData,
      );
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to update profile',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/logout/`);
      navigation.navigate(
        `${user_role === 'driver' ? 'DriverAuth' : 'PoliceAuth'}`,
        {
          screen: 'SignIn',
        },
      );
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={formData.firstname}
        onChangeText={text => setFormData({...formData, firstname: text})}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={formData.lastname}
        onChangeText={text => setFormData({...formData, lastname: text})}
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        value={formData.mobile_number}
        onChangeText={text => setFormData({...formData, mobile_number: text})}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'SAVING...' : 'SAVE PROFILE'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>LOG OUT</Text>
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
  label: {
    alignSelf: 'flex-start',
    color: '#A9A9A9',
    marginLeft: '10%',
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#2F3A4C',
  },
  button: {
    width: '80%',
    height: 45,
    backgroundColor: '#6E7C87',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '80%',
    height: 45,
    backgroundColor: '#A52A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
