import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import mydata from "../../utils/data";
import AdminHeader from "./AdminHeader";
const EditAgent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // agent id from navigation params

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_pass: "",
    location: "",
    status: "",
  });

  const [locations, setLocations] = useState([]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`http://${mydata.BASE_URL}/api/admin/getlocation`);
        const data = await response.json();
        if (Array.isArray(data.mylocation)) {
          setLocations(data.mylocation);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  // Fetch agent data
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`http://${mydata.BASE_URL}/api/admin/getagentdata/${id}`);
        const data = await res.json();

        if (data && data.myagent) {
          const agent = data.myagent;
          setFormData({
            name: agent.name || "",
            email: agent.email || "",
            mobile: agent.mobile || "",
            password: "",
            confirm_pass: "",
            location: agent.location || "",
            status: agent.status || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch agent:", err);
      }
    };
    fetchAgent();
  }, [id]);

  // Handle text input
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Submit update
  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://${mydata.BASE_URL}/api/admin/editagent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update agent");

      Alert.alert("Success", "Agent updated successfully", [
        { text: "OK", onPress: () => navigation.navigate("AgentList") },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update the agent");
    }
  };

  return (
    <>
    <AdminHeader />
    <ScrollView style={styles.container}>
        <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                  }}>
                  <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={{color: '#333', fontSize: 16}}>Dashboard </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Agents')}>
                    <Text style={{color: '#333', fontSize: 16}}>{'/ '}Agents</Text>
                  </TouchableOpacity>
                  <Text style={{color: '#b5895d', fontWeight: 'bold', fontSize: 16}}>
                    {' '}
                    / Edit Agents
                  </Text>
                </View>
      <Text style={styles.title}>Edit Agent</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        placeholder="Enter email"
      />

      <Text style={styles.label}>Mobile</Text>
      <TextInput
        style={styles.input}
        value={formData.mobile}
        onChangeText={(text) => handleChange("mobile", text)}
        keyboardType="phone-pad"
        maxLength={10}
        placeholder="Enter mobile number"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
        placeholder="Enter password"
      />

      <Text style={styles.label}>Re-enter Password</Text>
      <TextInput
        style={styles.input}
        value={formData.confirm_pass}
        onChangeText={(text) => handleChange("confirm_pass", text)}
        secureTextEntry
        placeholder="Confirm password"
      />

      <Text style={styles.label}>Location</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.location}
          onValueChange={(value) => handleChange("location", value)}
        >
          <Picker.Item label="Select location" value="" />
          {locations.map((loc, i) => (
            <Picker.Item
              key={i}
              label={loc.location || loc}
              value={loc.location || loc}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.status}
          onValueChange={(value) => handleChange("status", value)}
        >
          <Picker.Item label="Select Status" value="" />
          <Picker.Item label="Active" value="Active" />
          <Picker.Item label="Inactive" value="Inactive" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Information</Text>
      </TouchableOpacity>
    </ScrollView>
    </>
  );
};

export default EditAgent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f6f0",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#aa8453",
    padding: 14,
    borderRadius: 6,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
