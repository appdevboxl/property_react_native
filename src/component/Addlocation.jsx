import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import mydata from '../../utils/data'
import { useNavigation } from "@react-navigation/native";
import AdminHeader from "./AdminHeader";

const BASE_URL =  'http://' + mydata.BASE_URL;

const AddLocation = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({ location: "" });

  const handleChange = (value) => {
    setFormData({ location: value });
  };

  const handleSubmit = async () => {
    if (!formData.location.trim()) {
      Alert.alert("Validation Error", "Please enter a location");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/admin/addlocation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", result.message || "Location added successfully");
        setFormData({ location: "" });
      } else {
        Alert.alert("Error", result.message || "Failed to add location");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <>
    <AdminHeader />
    <ScrollView contentContainerStyle={styles.container}>
      {/* Breadcrumb */}
      <Text style={styles.breadcrumb}>
        <Text onPress={() => navigation.navigate("Dashboard")} style={styles.link}>
          Dashboard
        </Text>{" "}
        /{" "}
        <Text onPress={() => navigation.navigate("Locations")} style={styles.link}>
          Location
        </Text>{" "}
        / <Text style={styles.active}>Add Location</Text>
      </Text>

      {/* Page Title */}
      <Text style={styles.pageTitle}>Add Location</Text>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Name of the Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the Location"
          value={formData.location}
          onChangeText={handleChange}
          required
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Location</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f6f0",
    flexGrow: 1,
  },
  breadcrumb: {
    color: "#000",
    marginBottom: 10,
  },
  link: {
    color: "#000",
    fontSize: 16,
  },
  active: {
    color: "#aa8453",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 16,
  },
  form: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#aa8453",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddLocation;
