import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Updated Picker import
import { useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-toast-message'; // Commented out since not properly implemented
import Header from './AdminHeader';
import data from '../../utils/data';

const Properties = () => {
  const navigation = useNavigation();
  const [getlocation, setLocation] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    builder_name: '',
    description: '',
    property_type: '',
    property_status: '',
    location: '',
    price: '',
    area_from: '',
    area_to: '',
    price_from_words: '',
    price_to_words: '',
    price_from_number: '',
    price_to_number: '',
    address: '',
    video_url: '',
    construction_year: '',
    listing_status: '',
    property_for: '',
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://${data.BASE_URL}/api/admin/addproperty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message || 'Property added successfully!');
        // Reset form
        setFormData({
          title: '',
          builder_name: '',
          description: '',
          property_type: '',
          property_status: '',
          location: '',
          price: '',
          area_from: '',
          area_to: '',
          price_from_words: '',
          price_to_words: '',
          price_from_number: '',
          price_to_number: '',
          address: '',
          video_url: '',
          construction_year: '',
          listing_status: '',
          property_for: '',
        });
      } else {
        Alert.alert('Error', result.message || 'Failed to add property!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', error.message || 'Something went wrong!');
    }
  };

  useEffect(() => {
    Fetchlocation();
  }, []);

  const Fetchlocation = async () => {
    try {
      const response = await fetch(`http://${data.BASE_URL}/api/admin/getlocation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const mydata = await response.json();
      if (mydata.mylocation) {
        setLocation(mydata.mylocation);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch locations');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Header />
        <ScrollView style={styles.formContainer}>
          <View style={styles.breadcrumb}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.breadcrumbText}>Dashboard</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}> / </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Properties')}>
              <Text style={styles.breadcrumbText}>Properties</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}> / </Text>
            <Text style={[styles.breadcrumbText, styles.activeBreadcrumb]}>
              Add Property
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Property Title</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(value) => handleChange('title', value)}
              placeholder="Enter property title"
            />

            <Text style={styles.label}>Builder Name</Text>
            <TextInput
              style={styles.input}
              value={formData.builder_name}
              onChangeText={(value) => handleChange('builder_name', value)}
              placeholder="Enter builder name"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleChange('description', value)}
              multiline
              numberOfLines={6}
              placeholder="Enter property description"
            />

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Property Type</Text>
                <View style={styles.dropdown}>

                <Picker
                  selectedValue={formData.property_type}
                  onValueChange={(value) => handleChange('property_type', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Property Type" value="" />
                  {data?.property_types?.map((item, i) => (
                    <Picker.Item key={i} label={item} value={item} />
                  ))}
                </Picker>
                </View>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Property Status</Text>
                <View style={styles.dropdown}>
                <Picker
                  selectedValue={formData.property_status}
                  onValueChange={(value) => handleChange('property_status', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Status" value="" />
                  {data?.property_status_arr?.map((item, i) => (
                    <Picker.Item key={i} label={item} value={item} />
                  ))}
                </Picker>
              </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Property For</Text>
                <View style={styles.dropdown}>
                <Picker
                  selectedValue={formData.property_for}
                  onValueChange={(value) => handleChange('property_for', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Option" value="" />
                  {data?.prop_for?.map((item, i) => (
                    <Picker.Item key={i} label={item} value={item} />
                  ))}
                </Picker>
              </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.dropdown}>
                <Picker
                  selectedValue={formData.location}
                  onValueChange={(value) => handleChange('location', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select your location" value="" />
                  {getlocation?.map((item, i) => (
                    <Picker.Item key={i} label={item.location} value={item.location} />
                  ))}
                </Picker>
              </View>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Price (INR)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(value) => handleChange('price', value)}
                  keyboardType="numeric"
                  placeholder="Enter price"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Area sq feet (from)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.area_from}
                  onChangeText={(value) => handleChange('area_from', value)}
                  keyboardType="numeric"
                  placeholder="Enter area from"
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Area sq feet (to)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.area_to}
                  onChangeText={(value) => handleChange('area_to', value)}
                  keyboardType="numeric"
                  placeholder="Enter area to"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Price Starting From (in words)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price_from_words}
                  onChangeText={(value) => handleChange('price_from_words', value)}
                  placeholder="e.g., Ten Lakhs"
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Price To (in words)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price_to_words}
                  onChangeText={(value) => handleChange('price_to_words', value)}
                  placeholder="e.g., Twenty Lakhs"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Price Starting From (in number)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price_from_number}
                  onChangeText={(value) => handleChange('price_from_number', value)}
                  keyboardType="numeric"
                  placeholder="e.g., 1000000"
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Price To (in number)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price_to_number}
                  onChangeText={(value) => handleChange('price_to_number', value)}
                  keyboardType="numeric"
                  placeholder="e.g., 2000000"
                />
              </View>
            </View>

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(value) => handleChange('address', value)}
              placeholder="Enter full address"
            />

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Video URL</Text>
                <TextInput
                  style={styles.input}
                  value={formData.video_url}
                  onChangeText={(value) => handleChange('video_url', value)}
                  placeholder="Enter video URL"
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Year of Construction</Text>
                <View style={styles.dropdown}>
                <Picker
                  selectedValue={formData.construction_year}
                  onValueChange={(value) => handleChange('construction_year', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Year" value="" />
                  {data?.construction_year?.map((item, i) => (
                    <Picker.Item key={i} label={item} value={item} />
                  ))}
                </Picker>
                </View>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Listing Status</Text>
                <View style={styles.dropdown}>
              <Picker
                selectedValue={formData.listing_status}
                onValueChange={(value) => handleChange('listing_status', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Status" value="" />
                {data?.publish_status_arr?.map((item, i) => (
                  <Picker.Item key={i} label={item} value={item} />
                ))}
              </Picker>
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Save Information</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {/* Remove Toast component since it's not properly implemented */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f6f0',
  },
  mainContent: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  breadcrumbText: {
    color: '#000',
    fontSize: 16,
  },
  activeBreadcrumb: {
    color: '#aa8453',
  },
  breadcrumbSeparator: {
    color: '#000',
    marginHorizontal: 5,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: {
    flex: 1,
    marginRight: 10,
    
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',

    backgroundColor: '#fff',
    // marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#aa8453',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
    dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius:3,
  },
});

export default Properties;