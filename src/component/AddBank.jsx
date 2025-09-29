import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import mydata from "../../utils/data";
import AdminHeader from "./AdminHeader";

const AddBank = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    bank: "",
    ROI: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle text input change
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // pick image from gallery
  const handleFileChange = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 1 },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert("Error", response.errorMessage || "Image picker error");
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setFile(response.assets[0]);
        }
      }
    );
  };

  // submit form
  const handleSubmit = async () => {
    if (!formData.bank || !formData.ROI) {
      Alert.alert("Validation", "Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("bank", formData.bank);
      submitData.append("ROI", formData.ROI);

      if (file) {
        submitData.append("file", {
          uri: file.uri,
          type: file.type,
          name: file.fileName || "logo.jpg",
        });
      }

      const response = await fetch(
        `http://${mydata.BASE_URL}/api/admin/addbank`,
        {
          method: "POST",
          body: submitData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        Alert.alert("Success", result.message || "Bank added successfully!");
        setFormData({ bank: "", ROI: "" });
        setFile(null);
        navigation.navigate("Banks"); // navigate back to list
      } else {
        Alert.alert("Error", result.message || "Failed to add bank");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.breadcrumb}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                        <Text style={{color: '#333', fontSize: 16}}>Dashboard </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigation.navigate('Banks')}>
                        <Text style={{color: '#333', fontSize: 16}}>/ Bank</Text>
                      </TouchableOpacity>
                      <Text style={{color: '#b5895d', fontWeight: 'bold', fontSize: 16}}>
                        {' '}
                        / Add Bank
                      </Text>
                    </View>
        </Text>

        <Text style={styles.title}>Add Bank</Text>

        <Text style={styles.label}>Name of Bank</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Bank Name"
          value={formData.bank}
          onChangeText={text => handleChange("bank", text)}
        />

        {/* ROI */}
        <Text style={styles.label}>Rate of Interest (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8.5"
          value={formData.ROI}
          onChangeText={text => handleChange("ROI", text)}
          keyboardType="numeric"
        />

        {/* Logo upload */}
        <Text style={styles.label}>Upload Bank Logo</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleFileChange}>
          <Text style={styles.uploadBtnText}>
            {file ? "Change Logo" : "Pick Logo"}
          </Text>
        </TouchableOpacity>

        {file && (
          <Image
            source={{ uri: file.uri }}
            style={styles.preview}
            resizeMode="contain"
          />
        )}

        {/* Submit button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { backgroundColor: "#ccc" }]}
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

export default AddBank;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f9f6f0",
  },
  breadcrumb: { fontSize: 14, color: "#333" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 16,
  },
  label: { fontSize: 16, marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  uploadBtn: {
    backgroundColor: "#aa8453",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  uploadBtnText: { color: "#fff", fontWeight: "bold" },
  preview: {
    width: 120,
    height: 80,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  submitBtn: {
    backgroundColor: "#aa8453",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
