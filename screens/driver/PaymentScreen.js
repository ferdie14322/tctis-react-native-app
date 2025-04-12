import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import BASE_URL from '../../config';

const PaymentScreen = ({user_id, navigation}) => {
  const [ticketId, setTicketId] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const fetchFineAmount = async () => {
    if (!ticketId) {
      Alert.alert('Error', 'Please enter a ticket ID.');
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/ticket/${ticketId}/`);
      if (response.status === 200) {
        setFineAmount(response.data.fine_amount);
      } else {
        Alert.alert('Error', 'Ticket not found.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching ticket details.');
    }
  };

  const pickImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          setImageUri(response.assets[0].uri); // Access URI from response.assets
        }
      },
    );
  };

  const handlePayment = async () => {
    if (!ticketId) {
      Alert.alert('Error', 'Please enter a ticket ID.');
      return;
    }
    if (!imageUri) {
      Alert.alert('Error', 'Please upload a receipt image.');
      return;
    }

    const formData = new FormData();
    formData.append('ticket_id', ticketId);
    formData.append('user_id', user_id);
    formData.append('amount', fineAmount);
    formData.append('receipt_image', {
      uri: imageUri,
      name: `receipt_${ticketId}.jpg`,
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/add_payment/`,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Payment recorded successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.error || 'Payment failed.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while processing the payment.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Make a Payment</Text>

      <Text style={styles.label}>Ticket ID:</Text>
      <TextInput
        style={styles.input}
        value={ticketId}
        onChangeText={setTicketId}
        keyboardType="numeric"
        placeholder="Enter Ticket ID"
      />

      <Text style={styles.label}>Fine Amount:</Text>
      <TextInput
        style={styles.input}
        value={fineAmount ? String(fineAmount) : ''}
        editable={false}
        placeholder="Fine amount will appear here"
      />

      <Text style={styles.label}>Receipt Image:</Text>
      <TouchableOpacity style={styles.buttonImage} onPress={pickImage}>
        <Text style={styles.buttonImageText}>Upload Receipt</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{uri: imageUri}} style={styles.image} />}

      <TouchableOpacity style={styles.buttonImage} onPress={handlePayment}>
        <Text style={styles.buttonImageText}>Submit Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonImage: {
    width: '100%',
    backgroundColor: '#6E7C87',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 12,
  },
  buttonImageText: {
    color: 'white',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2F3A4C',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: 'white',
    textAlign: 'left',
    marginBottom: 8,
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default PaymentScreen;
