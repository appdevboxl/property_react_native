import { StyleSheet } from "react-native";
import React from "react";
import Home from "./src/component/Home";
import Browse from "./src/component/Browse";
import Sell from "./src/component/Sell";
import Emicalculator from "./src/component/Emicalculator";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack for Home so we can navigate to Browse from inside Home
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={Home} />
    <Stack.Screen name="Browse" component={Browse} />
  </Stack.Navigator>
);

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#aa8453",
        tabBarInactiveTintColor: "black",
        tabBarLabelStyle: { fontSize: 15 },
        tabBarStyle: { height: 60 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="BrowseTab"
        component={Browse}
        options={{
          tabBarLabel: "Browse",
          tabBarIcon: ({ color }) => <EvilIcons name="search" size={30} color={color} />,
        }}
      />
      <Tab.Screen
        name="Sell"
        component={Sell}
        options={{
          tabBarLabel: "Sell",
          tabBarIcon: ({ color }) => <MaterialIcons name="sell" size={30} color={color} />,
        }}
      />
      <Tab.Screen
        name="EMI_Calculator"
        component={Emicalculator}
        options={{
          tabBarLabel: "EMI Calculator",
          tabBarIcon: ({ color }) => <Entypo name="calculator" size={30} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
