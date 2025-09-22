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
import Ourservices from './src/component/Ourservices';
import Ourmission from './src/component/Ourmission';
import Timeline from './src/component/Timeline';
import About from './src/component/About';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeScreen" component={Home} />
    <Stack.Screen name="Browse" component={Browse} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="Ourservices" component={Ourservices} />
    <Stack.Screen name="Ourmission" component={Ourmission} />
    <Stack.Screen name="Timeline" component={Timeline} />
    <Stack.Screen name="About" component={About} />
  </Stack.Navigator>
);

const SellStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="SellScreen" component={Sell} />
    <Stack.Screen name="Home" component={Home} />
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
        component={Browse}
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
          tabBarLabel: 'EMI Calculator',
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
