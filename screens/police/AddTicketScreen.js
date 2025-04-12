import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Button,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import BASE_URL from '../../config.js';
import SignatureScreen from 'react-native-signature-canvas';
import {Image} from 'react-native';

const AddTicketScreen = ({route}) => {
  const {user_id, updateStatsAndActivity} = route.params || {};
  const [license, setLicense] = useState('');
  const [plate, setPlate] = useState('');
  const [location, setLocation] = useState('');
  const [fine, setFine] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [violations, setViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [signature, setSignature] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const signatureRef = useRef();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/get_drivers/`);
        setDrivers(response.data.drivers);
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch users. Please try again.');
      }
    };

    const fetchViolations = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/get_violations/`);
        setViolations(response.data);
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch violations. Please try again.');
      }
    };

    fetchViolations();
    fetchDrivers();
  }, []);

  const handleSignature = signatureResult => {
    setSignature(signatureResult);
    setShowSignatureModal(false);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const handleClear = () => {
    setSignature(null);
  };

  const addTicket = async () => {
    if (!signature) {
      Alert.alert('Error', 'Driver signature is required');
      return;
    }

    try {
      const ticketData = {
        license_no: license,
        plate_number: plate,
        user_id: selectedDriverId,
        violation_details: selectedViolation,
        fine_amount: fine,
        due_date: dueDate,
        status: 'Pending',
        issued_by: user_id,
        location: location,
        driver_signature: signature,
      };
      await axios.post(`${BASE_URL}/api/addticket/`, ticketData);
      Alert.alert('Success', 'Ticket has been added successfully.');
      if (updateStatsAndActivity) updateStatsAndActivity();
    } catch (error) {
      Alert.alert('Error', 'Failed to add ticket.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate.toISOString().split('T')[0]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Ticket</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter License Number"
        placeholderTextColor="grey"
        onChangeText={setLicense}
        value={license}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Plate Number"
        placeholderTextColor="grey"
        onChangeText={setPlate}
        value={plate}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Location"
        placeholderTextColor="grey"
        onChangeText={setLocation}
        value={location}
      />
      <Picker
        selectedValue={selectedDriverId}
        onValueChange={setSelectedDriverId}
        style={styles.picker}>
        {drivers.map(driver => (
          <Picker.Item
            key={driver.id}
            label={`${driver.firstname} ${driver.lastname}`}
            value={driver.id}
          />
        ))}
      </Picker>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}>
        <Text style={dueDate ? styles.dateText : styles.placeholderText}>
          {dueDate || 'Pick a Due Date'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          value={new Date()}
          onChange={handleDateChange}
        />
      )}
      <Picker
        selectedValue={selectedViolation}
        onValueChange={itemValue => {
          setSelectedViolation(itemValue);
          const selected = violations.find(v => v.id === itemValue);
          setFine(selected ? String(selected.penalty_amount || 0) : '');
        }}
        style={styles.picker}>
        <Picker.Item label="Select Violation" value="" />
        {violations.map(violation => (
          <Picker.Item
            key={violation.id}
            label={violation.name}
            value={violation.id}
          />
        ))}
      </Picker>
      <Modal
        visible={showSignatureModal}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.signatureContainer}>
            <SignatureScreen
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={handleEmpty}
              onClear={handleClear}
              descriptionText="Sign above"
              clearText="Clear"
              confirmText="Save"
              webStyle={webStyle}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSignatureModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Signature Section */}
      <View style={styles.signatureSection}>
        {signature && (
          <View style={styles.signaturePreviewContainer}>
            <Image
              style={styles.signatureImage}
              resizeMode={'contain'}
              source={{uri: signature}}
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.signatureButton}
          onPress={() => setShowSignatureModal(true)}>
          <Text style={styles.buttonText}>
            {signature ? 'Signature Captured' : 'Capture Driver Signature'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={addTicket}>
        <Text style={styles.buttonText}>Submit Ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

const webStyle = `
  .m-signature-pad {
    box-shadow: none;
    border: none;
  }
  .m-signature-pad--footer {
    margin: 0;
    padding: 0;
    height: auto;
  }
  .m-signature-pad--footer .button {
    background-color: #6E7C87;
    color: #FFF;
    margin: 0 5px;
  }
  body, html {
    height: 95%;
  }

`;

const SignatureDisplay = ({signature}) => {
  if (!signature) return null;

  return (
    <Image
      style={{width: 200, height: 100}}
      resizeMode={'contain'}
      source={{uri: signature}}
    />
  );
};

const styles = StyleSheet.create({
  signatureSection: {
    width: '80%',
    alignItems: 'center',
  },
  signaturePreviewContainer: {
    width: '100%',
    height: 100,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  signatureImage: {
    width: '100%',
    height: '100%',
  },
  signatureModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureButton: {
    backgroundColor: '#6E7C87',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  signatureContainer: {
    width: '90%',
    height: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#6E7C87',
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#2F3A4C',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: '#A9A9A9',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  button: {
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
  picker: {
    height: 50,
    width: '80%',
    color: '#A9A9A9',
    marginVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  dateButton: {
    width: '80%',
    marginTop: 3,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999999',
    fontSize: 16,
  },
  dateText: {
    color: '#333333',
    fontSize: 16,
  },
});

export default AddTicketScreen;
