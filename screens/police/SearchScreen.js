import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import BASE_URL from '../../config.js'; // Ensure BASE_URL is correctly configured

const SearchScreen = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setShowStartDatePicker(false); // Close the date picker after selection
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    setShowEndDatePicker(false); // Close the date picker after selection
  };

  const submitSearch = async () => {
    if (!startDate || !endDate) {
      alert('Please provide both start and end date');
      return;
    }

    setLoading(true);
    try {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      const response = await axios.get(`${BASE_URL}/api/tickets/search/`, {
        params: {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        },
      });
      console.log(response.data);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check My Tickets</Text>
      <Text style={styles.subTitle}>Search using Date Range</Text>

      {/* Start Date Picker */}
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={startDate.toLocaleDateString()}
          editable={false}
          placeholder="Start Date Range"
          placeholderTextColor="grey"
        />
      </TouchableOpacity>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {/* End Date Picker */}
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={endDate.toLocaleDateString()}
          editable={false}
          placeholder="End Date Range"
          placeholderTextColor="grey"
        />
      </TouchableOpacity>

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={submitSearch}>
        <Text style={styles.submitButtonText}>SUBMIT</Text>
      </TouchableOpacity>

      {/* Loading State */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {/* No Results Message */}
      {tickets.length === 0 && !loading && (
        <Text style={styles.noResultsText}>
          No tickets found for the selected date range.
        </Text>
      )}

      {/* Results */}
      <Text style={styles.resultTitle}>Search Results</Text>
      {tickets.length > 0 && !loading && (
        <ScrollView style={styles.resultsContainer}>
          {tickets.map((ticket, index) => (
            <View key={index} style={styles.ticket}>
              <Text style={styles.ticketTitle}>
                Fine Amount:{' '}
                <Text style={styles.ticketValue}>{ticket.fine_amount}</Text>
              </Text>
              <Text style={styles.ticketTitle}>
                Due Date:{' '}
                <Text style={styles.ticketValue}>{ticket.due_date}</Text>
              </Text>
              <Text style={styles.ticketTitle}>
                License No:{' '}
                <Text style={styles.ticketValue}>{ticket.license_no}</Text>
              </Text>
              <Text style={styles.ticketTitle}>
                Plate No:{' '}
                <Text style={styles.ticketValue}>{ticket.plate_number}</Text>
              </Text>
              <Text style={styles.ticketTitle}>
                Status: <Text style={styles.ticketValue}>{ticket.status}</Text>
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
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
    fontSize: 20,
    color: '#A9A9A9',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  subTitle: {
    fontSize: 16,
    color: '#A9A9A9',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  submitButton: {
    backgroundColor: '#4C5C6E',
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 15,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultTitle: {
    color: '#A9A9A9',
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  loadingText: {
    color: '#A9A9A9',
    fontSize: 16,
  },
  noResultsText: {
    color: '#A9A9A9',
    fontSize: 16,
    marginTop: 10,
  },
  resultsContainer: {
    marginTop: 15,
    width: '80%',
  },
  ticket: {
    backgroundColor: '#F0F0F0',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  ticketTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  ticketValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'normal',
  },
});

export default SearchScreen;
