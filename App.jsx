import {StyleSheet} from 'react-native';
import React from 'react';
import Home from './src/component/Home';
import Browse from './src/component/Browse';
import Sell from './src/component/Sell';
import Login from './src/component/Login';

import Emicalculator from './src/component/Emicalculator';
import Toast from 'react-native-toast-message';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Signup from './src/component/Signup';
import Dashboard from './src/component/Dashboard';
import Location from './src/component/Location';
import Compare from './src/component/Compare';
import ViewProperty from './src/component/ViewProperty';
import Addlocation from './src/component/Addlocation';
import Agent from './src/component/Agent';
import Leads from './src/component/Leads';
import Openleads from './src/component/Openleads';
import Closedleads from './src/component/Closedleads';
import Lostleads from './src/component/Lostleads';
import EditLead from './src/component/EditLead';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Browse" component={Browse} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="Locations" component={Location} />
    <Stack.Screen name="Addlocation" component={Addlocation} />
    <Stack.Screen name="Agents" component={Agent} />
    <Stack.Screen name="Leads" component={Leads} />
    <Stack.Screen name="Openleads" component={Openleads} />
    <Stack.Screen name="Closedleads" component={Closedleads} />
    <Stack.Screen name="Lostleads" component={Lostleads} />
    <Stack.Screen name="EditLead" component={EditLead} />
  </Stack.Navigator>
);

const SellStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="SellScreen" component={Sell} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="Dashboard" component={Dashboard} />
    {/* <Stack.Screen name="HomeScreen" component={Home} /> */}
  </Stack.Navigator>
);

const BrowseStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="BrowseScreen" component={Browse} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="Compare" component={Compare} />
    <Stack.Screen name="ViewProperty" component={ViewProperty} />
  </Stack.Navigator>
);

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#aa8453',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: {fontSize: 15},
        tabBarStyle: {height: 60},
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <AntDesign name="home" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BrowseTab"
        component={BrowseStack}
        options={{
          tabBarLabel: 'Browse',
          tabBarIcon: ({color}) => (
            <EvilIcons name="search" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Sell"
        component={SellStack}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: ({color}) => (
            <MaterialIcons name="sell" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EMI_Calculator"
        component={Emicalculator}
        options={{
          tabBarLabel: 'EMI',
          tabBarIcon: ({color}) => (
            <Entypo name="calculator" size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
