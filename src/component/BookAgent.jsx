import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";
import Footer from "./Footer";
import data from "../../utils/data";

const BookAgent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const [bookingStep, setBookingStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    propertyId: id,
    preferredDate: "",
    preferredTime: "",
    message: "",
    address: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (bookingStep === 1) {
      if (!formData.name || !formData.email || !formData.mobile_no) {
        Alert.alert("Validation Error", "Please fill all required fields.");
        return;
      }
    }
    setBookingStep((prev) => prev + 1);
  };

  const handleBack = () => setBookingStep((prev) => prev - 1);

  const agentDetails = {
    name: "Agent",
    specialty: "Residential Properties",
    rating: 4.9,
    image:
      "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?semt=ais_hybrid&w=740&q=80",
  };

  return (
    <>
      <Navbar />
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Book a Property Agent</Text>
        <Text style={styles.subtitle}>
          Professional assistance for your property needs
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={bookingStep >= 1 ? styles.activeStep : styles.step}>
          1. Details
        </Text>
        <Text style={bookingStep >= 2 ? styles.activeStep : styles.step}>
          2. Review
        </Text>
        <Text style={bookingStep >= 3 ? styles.activeStep : styles.step}>
          3. Confirmation
        </Text>
      </View>

      {/* Agent Card */}
      <View style={styles.agentCard}>
        <Image source={{ uri: agentDetails.image }} style={styles.agentImage} />
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>{agentDetails.name}</Text>
          <Text style={styles.agentSpec}>{agentDetails.specialty}</Text>
          <Text>⭐ {agentDetails.rating}</Text>
        </View>
        <Text style={styles.agentPrice}>₹{data.agentfees}</Text>
      </View>

      {/* Step 1: Form */}
      {bookingStep === 1 && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(val) => handleInputChange("name", val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(val) => handleInputChange("email", val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile No"
            keyboardType="numeric"
            maxLength={10}
            value={formData.mobile_no}
            onChangeText={(val) => handleInputChange("mobile_no", val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Preferred Date (YYYY-MM-DD)"
            value={formData.preferredDate}
            onChangeText={(val) => handleInputChange("preferredDate", val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Preferred Time (e.g. 2:00 PM)"
            value={formData.preferredTime}
            onChangeText={(val) => handleInputChange("preferredTime", val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={formData.address}
            onChangeText={(val) => handleInputChange("address", val)}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Additional Message (Optional)"
            multiline
            value={formData.message}
            onChangeText={(val) => handleInputChange("message", val)}
          />
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Review */}
      {bookingStep === 2 && (
        <View>
          <Text style={styles.sectionTitle}>Review Your Details</Text>
          <Text>Name: {formData.name}</Text>
          <Text>Email: {formData.email}</Text>
          <Text>Mobile: {formData.mobile_no}</Text>
          <Text>Date: {formData.preferredDate}</Text>
          <Text>Time: {formData.preferredTime}</Text>
          <Text>Address: {formData.address}</Text>
          <Text>Message: {formData.message}</Text>
          <Text style={styles.sectionTitle}>
            Agent Fee: ₹{data.agentfees}
          </Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 3: Confirmation */}
      {bookingStep === 3 && (
        <View style={styles.confirmBox}>
          <Text style={styles.success}>✅ Booking Confirmed!</Text>
          <Text>Your agent has been successfully booked.</Text>
          <Text>
            {formData.preferredDate} at {formData.preferredTime}
          </Text>
          <Text>Amount: ₹{data.agentfees}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setBookingStep(1);
              setFormData({
                name: "",
                email: "",
                mobile_no: "",
                propertyId: id,
                preferredDate: "",
                preferredTime: "",
                message: "",
                address: "",
              });
            }}
          >
            <Text style={styles.buttonText}>Book Another Agent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate("Browse")}
          >
            <Text style={styles.backText}>Go to Browse Page</Text>
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
    </>
  );
};

export default BookAgent;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: { alignItems: "center", marginVertical: 10 },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#555" },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  step: { color: "#888" },
  activeStep: { color: "#aa8453", fontWeight: "bold" },
  agentCard: {
    flexDirection: "row",
    backgroundColor: "#f6efeb",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  agentImage: { width: 60, height: 60, borderRadius: 30 },
  agentInfo: { flex: 1, marginLeft: 10 },
  agentName: { fontSize: 16, fontWeight: "bold" },
  agentSpec: { color: "#555" },
  agentPrice: { color: "#aa8453", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#aa8453",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  backBtn: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    minWidth: 120,
  },
  backText: { color: "#000", fontWeight: "bold" },
  confirmBox: { alignItems: "center", marginVertical: 20 },
  success: {
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
    marginBottom: 10,
  },
});
