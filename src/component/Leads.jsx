import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import AdminHeader from "./AdminHeader";

const Dashboard = () => {
  const navigation = useNavigation();

  const cards = [
    { id: 1, title: "Open Leads", subtitle: "View all open leads", color: "#13cd89", icon: "folder-open", route: "Openleads" },
    { id: 2, title: "Closed Leads", subtitle: "View all closed leads", color: "#f1c643", icon: "check-circle", route: "Closedleads" },
    { id: 3, title: "Lost Leads", subtitle: "View all lost leads", color: "#ee6565", icon: "times", route: "Lostleads" },

  ];

  return (
    <>
    <AdminHeader />
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={{ color: '#333', fontSize: 16 }}>Dashboard</Text>
                  </TouchableOpacity>
                  <Text style={{ color: '#b5895d', fontWeight: 'bold', fontSize: 16 } }> / Leads</Text>
                </View>
      <Text style={styles.heading}>Leads</Text>

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
    marginTop: 10,
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
