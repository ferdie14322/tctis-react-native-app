import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../../config';

const ProfileScreen = ({route, navigation}) => {
  const {user_id, user_role} = route.params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    mobile_number: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/user_profile/${user_id}/`,
        );
        setUserData(response.data);
        setFormData({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          mobile_number: response.data.mobile_number,
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Unable to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user_id]);

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        mobile_number: formData.mobile_number,
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await axios.put(
        `${BASE_URL}/api/user_profile/${user_id}/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add your authorization header if needed
            // 'Authorization': `Bearer ${your_token_here}`,
          },
        }
      );
      
      Alert.alert('Success', 'Profile updated successfully');
      // Refresh user data after update
      const updatedResponse = await axios.get(`${BASE_URL}/api/user_profile/${user_id}/`);
      setUserData(updatedResponse.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      let errorMessage = 'Failed to update profile';
      if (error.response) {
        errorMessage = error.response.data.error || 
                      error.response.data.message || 
                      JSON.stringify(error.response.data);
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/logout/`);
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      
      // Navigate to the correct auth stack based on user role
      navigation.navigate(`${user_role === 'police' ? 'PoliceAuth' : 'DriverAuth'}`, { 
        screen: 'SignIn' 
      });
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6E7C87" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit My Profile</Text>

      {userData ? (
        <>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formData.firstname}
            placeholderTextColor="#A9C4A8"
            onChangeText={value => handleInputChange('firstname', value)}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.lastname}
            placeholderTextColor="#A9C4A8"
            onChangeText={value => handleInputChange('lastname', value)}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={formData.mobile_number}
            placeholderTextColor="#A9C4A8"
            keyboardType="phone-pad"
            onChangeText={value => handleInputChange('mobile_number', value)}
          />

          <Text style={styles.userId}>My ID: {userData.user_id}</Text>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading profile...</Text>
      )}

      {/* <TouchableOpacity 
        style={styles.editButton} 
        onPress={handleSave}
        disabled={updating}
      >
        {updating ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>SAVE CHANGES</Text>
        )}
      </TouchableOpacity> */}

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
        disabled={updating}
      >
        <Text style={styles.buttonText}>LOGOUT</Text>
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
  loadingContainer: {
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    color: '#A9A9A9',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  label: {
    color: 'white',
    width: '80%',
    marginBottom: 5,
    marginTop: 10,
    textAlign: 'left',
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#2F3A4C',
  },
  userId: {
    fontSize: 16,
    color: '#A9A9A9',
    marginVertical: 15,
  },
  editButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#6E7C87',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  logoutButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;