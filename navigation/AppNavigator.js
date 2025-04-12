import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import DashboardScreen from '../screens/police/DashboardScreen';
import AddTicketScreen from '../screens/police/AddTicketScreen';
import PoliceSearchScreen from '../screens/police/SearchScreen';
import ProfileScreen from '../screens/police/ProfileScreen';
import TicketsPage from '../screens/police/TicketsPage';

import DriverDashboardScreen from '../screens/driver/DashboardScreen';
import ActiveTicketsScreen from '../screens/driver/ActiveTicketsScreen';
import DriverProfileScreen from '../screens/driver/ProfileScreen';
import DisputeScreen from '../screens/driver/DisputeScreen';
import MyDisputesScreen from '../screens/driver/MyDisputeScreen';

import PoliceSignInScreen from '../screens/auth/police/SignInScreen';
import PoliceSignUpScreen from '../screens/auth/police/SignUpScreen';
import PaymentScreen from '../screens/driver/PaymentScreen';
import SignInScreen from '../screens/auth/police/SignInScreen';
import SignUpScreen from '../screens/auth/police/SignUpScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function PoliceDrawerNavigator({route}) {
  // Add proper default values and error handling
  const {
    user_id = '',
    user_firstname = '',
    user_lastname = '',
  } = route?.params || {};

  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen
        name="Dashboard"
        children={props => (
          <DashboardScreen
            {...props}
            user_id={user_id}
            user_firstname={user_firstname}
            user_lastname={user_lastname}
          />
        )}
      />
      <Drawer.Screen
        name="Add Ticket"
        children={props => <AddTicketScreen {...props} user_id={user_id} />}
      />
      <Drawer.Screen name="Search Tickets" component={PoliceSearchScreen} />
      <Drawer.Screen
        name="Tickets List"
        children={props => <TicketsPage {...props} user_id={user_id} />}
      />
      <Drawer.Screen
        name="Profile"
        children={props => (
          <ProfileScreen
            {...props}
            user_id={user_id}
            user_firstname={user_firstname}
            user_lastname={user_lastname}
            user_role="police"
          />
        )}
      />
    </Drawer.Navigator>
  );
}

function DriverDrawerNavigator({route}) {
  const {
    user_id = '',
    user_firstname = '',
    user_lastname = '',
  } = route?.params || {};

  return (
    <Drawer.Navigator initialRouteName="Driver Dashboard">
      <Drawer.Screen
        name="Driver Dashboard"
        children={props => (
          <DriverDashboardScreen
            {...props}
            user_id={user_id}
            user_firstname={user_firstname}
            user_lastname={user_lastname}
          />
        )}
      />
      <Drawer.Screen
        name="Active Tickets"
        children={props => <ActiveTicketsScreen {...props} user_id={user_id} />}
      />
      <Drawer.Screen
        name="File Disputes"
        children={props => <DisputeScreen {...props} user_id={user_id} />}
      />
      <Drawer.Screen
        name="My Disputes"
        children={props => <MyDisputesScreen {...props} user_id={user_id} />}
      />

      <Drawer.Screen
        name="Profile"
        children={props => (
          <ProfileScreen {...props} user_id={user_id} user_role="driver" />
        )}
      />
    </Drawer.Navigator>
  );
}

function PoliceAuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={PoliceSignInScreen} />
      <Stack.Screen name="SignUp" component={PoliceSignUpScreen} />
    </Stack.Navigator>
  );
}

function DriverAuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="PoliceAuth" component={PoliceAuthStack} />
        <Stack.Screen name="DriverAuth" component={DriverAuthStack} />
        <Stack.Screen
          name="PoliceMain"
          component={PoliceDrawerNavigator}
          initialParams={{user_id: '', user_firstname: '', user_lastname: ''}}
        />
        <Stack.Screen
          name="DriverMain"
          component={DriverDrawerNavigator}
          initialParams={{user_id: '', user_firstname: '', user_lastname: ''}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
