import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import BASE_URL from '../../../config.js';

const SignInScreen = ({navigation}) => {
  const [userType, setUserType] = useState('Police');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(`${BASE_URL}/api/login/`, {
      username: username,
      password: password,
      role: userType, // Send the selected role to backend
    });

    if (response.status === 200) {
      const {user_id, firstname, lastname, role} = response.data;

      // Double-check the role (though backend already validated)
      if (role.toLowerCase() !== userType.toLowerCase()) {
        throw new Error(`You are not registered as a ${userType}`);
      }

      if (userType === 'Police') {
        navigation.navigate('PoliceMain', {
          user_id,
          user_firstname: firstname,
          user_lastname: lastname,
        });
      } else if (userType === 'Driver') {
        navigation.navigate('DriverMain', {
          user_id,
          user_firstname: firstname,
          user_lastname: lastname,
        });
      }
    }
  } catch (error) {
    Alert.alert(
      'Login Failed',
      error.response?.data?.error || error.message || 'Invalid credentials. Please try again.',
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Traffic Citation Ticket Information System
      </Text>

      <Picker
        selectedValue={userType}
        style={styles.picker}
        onValueChange={itemValue => setUserType(itemValue)}>
        <Picker.Item label="Police" value="Police" />
        <Picker.Item label="Driver" value="Driver" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="grey"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="grey"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6E7C87" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign up here.</Text>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#A9A9A9',
    marginBottom: 40,
    textAlign: 'center',
    width: '80%',
  },
  picker: {
    height: 50,
    width: '80%',
    color: '#A9A9A9',
    marginVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
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
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#6E7C87',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#F0F0F0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#A9A9A9',
    marginTop: 15,
  },
});

export default SignInScreen;
