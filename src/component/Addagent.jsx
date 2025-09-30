import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import mydata from "../../utils/data";
import AdminHeader from "./AdminHeader";
const AddAgents = ({ navigation }) => {
  // Email validation regex
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  // Validate all fields and email
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.password || !formData.confirm_pass || !formData.location) {
      Alert.alert('Error', 'Please fill all fields.');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (formData.password !== formData.confirm_pass) {
      Alert.alert('Error', 'Passwords do not match!');
      return false;
    }
    return true;
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_pass: "",
    location: "",
  });

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`http://${mydata.BASE_URL}/api/admin/getlocation`); // ✅ Android Emulator (change to localhost for iOS)
        const data = await response.json();
        if (Array.isArray(data.mylocation)) {
          setLocations(data.mylocation);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  // Handle input change
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://${mydata.BASE_URL}/api/admin/addagent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Agent added successfully!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirm_pass: "",
          location: "",
        });
      } else {
        Alert.alert("Error", result.message || "Failed to add agent");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
  <>  
  <AdminHeader/>
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
                  <Text style={{color: '#333', fontSize: 16}}>/ Agents</Text>
                </TouchableOpacity>
                <Text style={{color: '#b5895d', fontWeight: 'bold', fontSize: 16}}>
                  {' '}
                  / Add Agents
                </Text>
              </View>
      <Text style={styles.title}>Add New Agent</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      {/* Email & Mobile */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile"
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.mobile}
            onChangeText={(text) => handleChange("mobile", text)}
          />
        </View>
      </View>

      {/* Password & Confirm Password */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Re-enter Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry
            value={formData.confirm_pass}
            onChangeText={(text) => handleChange("confirm_pass", text)}
          />
        </View>
      </View>

      {/* Location Picker */}
      <Text style={styles.label}>Location</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.location}
          onValueChange={(value) => handleChange("location", value)}
        >
          <Picker.Item label="Select your location" value="" />
          {locations.map((loc, i) => (
            <Picker.Item
              key={i}
              label={loc.location || loc}
              value={loc.location || loc}
            />
          ))}
        </Picker>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>Save Information</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
    
</>
  );
};

export default AddAgents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f6f0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    width: "48%",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 6,
    backgroundColor: "#fff",
  },
  submitBtn: {
    backgroundColor: "#aa8453",
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
