import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import mydata from '../../utils/data'
const Signup = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    terms: false,
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { firstname, lastname, email, password } = formData;
    const userData = { firstname, lastname, email, password };

    try {
      const response = await fetch(`http://${mydata.BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message || "User registered successfully");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          terms: false,
        });
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "Registration failed!");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Create an account</Text>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor="#ccc"
              value={formData.firstname}
              onChangeText={(text) => handleChange("firstname", text)}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#ccc"
              value={formData.lastname}
              onChangeText={(text) => handleChange("lastname", text)}
            />
          </View>
        </View>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
        />

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => handleChange("terms", !formData.terms)}
        >
          <View
            style={[
              styles.checkbox,
              formData.terms && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.termsText}>
            I accept the{" "}
            <Text style={styles.link}>Terms and Conditions</Text>
          </Text>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Login Redirect */}
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Login here
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0a0a2a",
    justifyContent: "center",
    padding: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 150,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#aa8453",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    paddingVertical: 8,
    color: "#fff",
    marginBottom: 15,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#aa8453",
  },
  termsText: {
    color: "#fff",
    fontSize: 13,
  },
  link: {
    color: "#aa8453",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#aa8453",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  footerText: {
    marginTop: 15,
    textAlign: "center",
    color: "#ccc",
  },
});
