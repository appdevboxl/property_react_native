import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Sell = ({navigation}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    location: '',
    mobile_no: '',
    message: '',
  });
  console.log(formData);
  const handleChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
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
        <Text style={{fontSize: 20, fontWeight: 400, marginTop: 10}}>
          Send Message
        </Text>
        <View style={{gap: 15, marginBottom: 20}}>
          <View>
            <Text>Name</Text>
            <TextInput
              placeholder=""
              style={styles.inputstyle}
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
            />
          </View>
          <View>
            <Text>Email</Text>
            <TextInput
              placeholder=""
              style={styles.inputstyle}
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
            />
          </View>
          <View>
            <Text>Address</Text>
            <TextInput
              placeholder=""
              style={styles.inputstyle}
              value={formData.address}
              onChangeText={text => handleChange('address', text)}
            />
          </View>
          <View>
            <Text>Location</Text>
            <TextInput
              placeholder=""
              style={styles.inputstyle}
              value={formData.location}
              onChangeText={text => handleChange('location', text)}
            />
          </View>
          <View>
            <Text>Mobile No.</Text>
            <TextInput
              placeholder="Mobile Number"
              style={styles.inputstyle}
              value={formData.mobile_no}
              keyboardType="numeric" // better for digits only
              maxLength={10} // limit to 10 digits
              onChangeText={
                text => handleChange('mobile_no', text.replace(/[^0-9]/g, '')) // remove non-digits
              }
            />
          </View>
          <View>
            <Text>Message</Text>
            <TextInput
              style={[styles.inputstyle, {height: 100}]}
              // value={formData.message}
              multiline
              value={formData.message}
              onChangeText={text => handleChange('message', text)}
            />
          </View>
        <Pressable>
          <Text style={styles.button}>Send Message</Text>
        </Pressable>
        </View>
      </View>

      <Footer />
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
    fontWeight: 800,
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
  button:{
    padding:10,
    backgroundColor:"#aa8460",
    width:"40%",
    color:'white',
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:'25'
  }
});
