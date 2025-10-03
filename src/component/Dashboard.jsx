import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import AdminHeader from "./AdminHeader";
const Dashboard = () => {
  const navigation = useNavigation();
  // console.log(global.authToken);
  
  const cards = [
    { id: 1, title: "Properties", subtitle: "Property Listings", color: "#6d7175", icon: "home", route: "Properties" },
    { id: 2, title: "Locations", subtitle: "Cities/Area", color: "#13cd89", icon: "map-marker-alt", route: "Locations" },
    { id: 3, title: "Agents", subtitle: "Agents Listing", color: "#f1c643", icon: "network-wired", route: "Agents" },
    { id: 4, title: "Leads", subtitle: "Leads & Queries", color: "#ee6565", icon: "comments-dollar", route: "Leads" },
    { id: 5, title: "Amenities", subtitle: "List of Amenities", color: "#6d7175", icon: "star", route: "Amenities" },
    { id: 6, title: "Banks", subtitle: "List of Banks", color: "#13cd89", icon: "university", route: "Banks" },
    { id: 7, title: "Customers", subtitle: "Customers Data", color: "#f1c643", icon: "user", route: "Customers" },
    { id: 8, title: "Appointments", subtitle: "Customers Appointments", color: "#dd3d28c9", icon: "calendar-check", route: "Appointments" },
  ];

  return (
    <>
    <AdminHeader />
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>

      {cards.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.card, { backgroundColor: item.color }]}
          onPress={() => navigation.navigate(item.route)} names
        >
          <View style={styles.cardContent}>
            <Icon name={item.icon} size={24} color="#fff" style={styles.cardIcon} />
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    width: "100%", // 👈 one card per row
    borderRadius: 12,
    marginBottom: 16,
    padding: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#fff",
  },
});
