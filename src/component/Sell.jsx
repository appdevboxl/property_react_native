import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker'; 
import Navbar from './Navbar';
import mydata from '../../utils/data'
const Sell = ({navigation}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    location: '',
    mobile_no: '',
    message: '',
  });

  const [locations, setLocations] = useState([]); 

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          `http://${mydata.BASE_URL}/api/admin/getlocation`,
        );
        const data = await response.json();
        setLocations(data.mylocation);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async () => {
    const {name, email, address, location, mobile_no, message} = formData;
    const userData = {name, email, address, location, mobile_no, message};

    try {
      const response = await fetch(
        `http://${mydata.BASE_URL}/api/property/sell`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message || 'Sell request send successfully');
        setFormData({
          name: '',
          email: '',
          address: '',
          location: '',
          mobile_no: '',
          message: '',
        });
        // storage.set('token', data.token);
      } else {
        Alert.alert('Error', data.message || 'Sell request failed!');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <ScrollView>
      <Navbar />
      <View style={styles.container}>
        <TouchableOpacity>
          <Text style={{cursor: 'pointer'}}>Home /</Text>
        </TouchableOpacity>

        <Text style={{color: '#988440ff'}}>Sell</Text>
      </View>

      <View style={styles.mainview}>
        <Text style={styles.main}>Sell page</Text>
        <Text style={{fontSize: 20, fontWeight: '400', marginTop: 10}}>
          Send Message
        </Text>

        <View style={{gap: 15, marginBottom: 20}}>
          {/* Name */}
          <View>
            <Text>Name</Text>
            <TextInput
              placeholder=""
              style={styles.inputstyle}
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
            />
          </View>

          {/* Email */}
          <View>
            <Text>Email</Text>
            <TextInput
              placeholder=""
              style={styles.inputstyle}
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
            />
          </View>

          {/* Address */}
          <View>
            <Text>Address</Text>
            <TextInput
              placeholder=""
              style={styles.inputstyle}
              value={formData.address}
              onChangeText={text => handleChange('address', text)}
            />
          </View>

          {/* ✅ Location Dropdown */}
          <View>
            <Text>Location</Text>
            <View style={styles.dropdown}>
              <Picker
                selectedValue={formData.location}
                onValueChange={value => handleChange('location', value)}>
                <Picker.Item label="Select Location" value="" />
                {locations.map(loc => (
                  <Picker.Item
                    key={loc.id}
                    label={loc.location}
                    value={loc.location}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Mobile */}
          <View>
            <Text>Mobile No.</Text>
            <TextInput
              placeholder="Mobile Number"
              style={styles.inputstyle}
              value={formData.mobile_no}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={text =>
                handleChange('mobile_no', text.replace(/[^0-9]/g, ''))
              }
            />
          </View>

          {/* Message */}
          <View>
            <Text>Message</Text>
            <TextInput
              style={[styles.inputstyle, {height: 100}]}
              multiline
              value={formData.message}
              onChangeText={text => handleChange('message', text)}
            />
          </View>

          <Pressable onPress={handleSubmit}>
            <Text style={styles.button}>Send Message</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Sell;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  main: {
    fontSize: 30,
    fontWeight: '800',
  },
  mainview: {
    paddingHorizontal: 15,
  },
  inputstyle: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    borderRadius: 0,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 0,
  },
  button: {
    padding: 10,
    backgroundColor: '#aa8460',
    width: '40%',
    color: 'white',
    textAlign: 'center',
  },
});
