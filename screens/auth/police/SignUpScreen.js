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

const SignUpScreen = ({navigation}) => {
  const [firstname, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (
      !firstname ||
      !lastName ||
      !username ||
      !password ||
      !mobile_number ||
      !userType
    ) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/signup/`, {
        firstname,
        lastname: lastName,
        username,
        password,
        mobile_number,
        role: userType,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Account created successfully!');
        const {id, firstname, lastname} = response.data;

        const screen = userType === 'Police' ? 'PoliceMain' : 'DriverMain';
        navigation.navigate(screen, {
          user_id: id,
          user_firstname: firstname,
          user_lastname: lastname,
        });
      }
    } catch (error) {
      setLoading(false);

      if (error.response?.data?.username) {
        Alert.alert(
          'Signup Error',
          'This username is already taken. Please choose another.',
        );
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.message ||
            'Unable to sign up. Please try again.',
        );
      }
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
        <Picker.Item label="Select Role" value="" />
        <Picker.Item label="Police" value="Police" />
        <Picker.Item label="Driver" value="Driver" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="grey"
        value={firstname}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="grey"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="grey"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="grey"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        placeholderTextColor="grey"
        value={mobile_number}
        onChangeText={setMobileNumber}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6E7C87" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Have an account already? Go to Login</Text>
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

export default SignUpScreen;
