import React, { useEffect, useState } from "react";
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
  Platform,
  PermissionsAndroid,
  Linking,
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

  // Handle text input change
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

useEffect(() => {
  requestMediaPermission();
}, []);


// ✅ Add this helper function
const requestStoragePermission = async () => {
  if (Platform.OS === "android") {
    try {
      let permission;
      if (Platform.Version >= 33) {
        // Android 13+
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      } else {
        // Android 12 and below
        permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      }

      const granted = await PermissionsAndroid.request(permission);
      console.log("Already has permission:", granted === PermissionsAndroid.RESULTS.GRANTED);

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  }
  return true; // iOS automatically handles permissions
};



  // Request storage permission for Android
const requestMediaPermission = async () => {
  try {
    if (Platform.OS === "android") {
      let permission;

      if (Platform.Version >= 33) {
        // Android 13+
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      } else {
        // Android 12 and below
        permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      }

      const granted = await PermissionsAndroid.request(permission, {
        title: "Storage Permission",
        message: "App needs access to your photos to upload images.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permission granted ✅");
      } else {
        console.log("Permission denied ❌");
      }
    }
  } catch (err) {
    console.warn(err);
  }
};


  // Check if we already have permission
  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const androidVersion = Platform.Version;
        const permission = androidVersion >= 33 
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        console.log('Already has permission:', hasPermission);
        return hasPermission;
      } catch (err) {
        console.warn('Check permission error:', err);
        return false;
      }
    }
    return true;
  };

  // Pick image from gallery with proper permission handling
  const handleFileChange = async () => {
    try {
      // First check if we already have permission
      const hasPermission = await checkPermission();
      
      if (!hasPermission) {
        // Request permission
        const permissionGranted = await requestStoragePermission();
        if (!permissionGranted) {
          Alert.alert(
            "Permission Required", 
            "Storage permission is required to select images. Please allow the permission in settings.",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Open Settings", 
                onPress: () => {
                  if (Platform.OS === 'android') {
                    // Open app settings on Android
                    Linking.openSettings?.();
                  }
                } 
              }
            ]
          );
          return;
        }
      }

      // Now we have permission, launch image picker
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        includeBase64: false,
        selectionLimit: 1,
      };

      launchImageLibrary(options, (response) => {
        console.log('ImagePicker Response:', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error:', response.errorCode, response.errorMessage);
          Alert.alert("Error", "Failed to pick image: " + (response.errorMessage || "Unknown error"));
        } else if (response.assets && response.assets.length > 0) {
          const selectedFile = response.assets[0];
          console.log('Selected file:', selectedFile);
          
          // Validate file size (5MB limit)
          if (selectedFile.fileSize > 5 * 1024 * 1024) {
            Alert.alert("Error", "Image size should be less than 5MB");
            return;
          }
          
          setFile(selectedFile);
          Alert.alert("Success", "Logo selected successfully!");
        }
      });

    } catch (error) {
      console.error('Error in handleFileChange:', error);
      Alert.alert("Error", "Failed to open image picker");
    }
  };

  // Simple version without permission checks (for testing)
  const handleFileChangeSimple = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert("Error", "Failed to pick image: " + response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedFile = response.assets[0];
        setFile(selectedFile);
        Alert.alert("Success", "Logo selected successfully!");
      }
    });
  };

  // Validate form
  const validateForm = () => {
    if (!formData.bank.trim()) {
      Alert.alert("Validation", "Please enter bank name");
      return false;
    }
    if (!formData.ROI.trim()) {
      Alert.alert("Validation", "Please enter rate of interest");
      return false;
    }
    
    const roiValue = parseFloat(formData.ROI);
    if (isNaN(roiValue) || roiValue <= 0 || roiValue > 100) {
      Alert.alert("Validation", "Please enter a valid rate of interest (0-100)");
      return false;
    }

    if (!file) {
      Alert.alert("Validation", "Please upload bank logo");
      return false;
    }

    return true;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("bank", formData.bank.trim());
      submitData.append("ROI", parseFloat(formData.ROI).toString());

      if (file) {
        submitData.append("file", {
          uri: file.uri,
          type: file.type || "image/jpeg",
          name: file.fileName || `bank_logo_${Date.now()}.jpg`,
        });
      }

      const response = await fetch(
        `http://${mydata.BASE_URL}/api/admin/addbank`,
        {
          method: "POST",
          body: submitData,
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert("Success", result.message || "Bank added successfully!", [
          {
            text: "OK",
            onPress: () => {
              setFormData({ bank: "", ROI: "" });
              setFile(null);
              navigation.navigate("Banks");
            },
          },
        ]);
      } else {
        throw new Error(result.message || "Failed to add bank");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert(
        "Error", 
        error.message || "Server error, please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setFile(null);
  };

  return (
    <View style={styles.container}>
      <AdminHeader />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
            <Text style={styles.breadcrumbText}>Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}> / </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Banks")}>
            <Text style={styles.breadcrumbText}>Banks</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}> / </Text>
          <Text style={[styles.breadcrumbText, styles.activeBreadcrumb]}>
            Add Bank
          </Text>
        </View>

        {/* Form Title */}
        <Text style={styles.title}>Add Bank</Text>

        {/* Bank Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bank Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bank Name"
            value={formData.bank}
            onChangeText={text => handleChange("bank", text)}
            editable={!loading}
          />
        </View>

        {/* ROI */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rate of Interest (%) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 8.5"
            value={formData.ROI}
            onChangeText={text => handleChange("ROI", text)}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        {/* Logo Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bank Logo *</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.uploadBtn, 
                loading && styles.disabledButton
              ]} 
              onPress={handleFileChange}
              disabled={loading}
            >
              <Text style={styles.uploadBtnText}>
                {file ? "Change Logo" : "Choose Logo"}
              </Text>
            </TouchableOpacity>

            {/* Alternative button that uses simple method */}
            <TouchableOpacity 
              style={[
                styles.altUploadBtn, 
                loading && styles.disabledButton
              ]} 
              onPress={handleFileChangeSimple}
              disabled={loading}
            >
              <Text style={styles.altUploadBtnText}>Try Simple Picker</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helpText}>
            {Platform.OS === 'android' 
              ? "You'll be asked for permission to access your photos"
              : "Select a logo from your photo library"
            }
          </Text>

          {file && (
            <View style={styles.imageContainer}>
              <Text style={styles.selectedText}>Selected Logo:</Text>
              <Image
                source={{ uri: file.uri }}
                style={styles.preview}
                resizeMode="contain"
              />
              <Text style={styles.fileInfo}>
                {file.fileName || 'logo.jpg'} ({(file.fileSize / 1024).toFixed(1)} KB)
              </Text>
              <TouchableOpacity 
                style={styles.removeImageBtn} 
                onPress={removeImage}
                disabled={loading}
              >
                <Text style={styles.removeImageText}>Remove Logo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn, 
            loading && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Save Bank Information</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f6f0",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  breadcrumbText: {
    fontSize: 14,
    color: "#333",
  },
  activeBreadcrumb: {
    color: "#b5895d",
    fontWeight: "bold",
  },
  breadcrumbSeparator: {
    color: "#333",
    marginHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 25,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  uploadBtn: {
    backgroundColor: "#aa8453",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  uploadBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  altUploadBtn: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  altUploadBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  helpText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
  preview: {
    width: 200,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  fileInfo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  removeImageBtn: {
    padding: 10,
    backgroundColor: "#ff4444",
    borderRadius: 6,
    minWidth: 120,
    alignItems: "center",
  },
  removeImageText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: "#aa8453",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
});

export default AddBank;