import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
const Login = ({navigation}) => {
//   const mnavigation = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };
  console.log(formData);
  return (
    <View style={styles.container}>
      <View style={styles.innerbox}>
        <Text style={{fontSize: 25, fontWeight: '700', marginBottom: 20}}>
          User Login
        </Text>
        <View style={{marginBottom: 20}}>
          <Text>Email</Text>
          <TextInput
            placeholder=""
            style={styles.inputstyle}
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
          />
        </View>
        <View style={{marginBottom: 20}}>
          <Text>Password</Text>
          <TextInput
            placeholder=""
            style={styles.inputstyle}
            value={formData.password}
            onChangeText={text => handleChange('password', text)}
            secureTextEntry={true}
          />
        </View>
        <View>
          <Text style={styles.signinbtn}>Sign In</Text>
        </View>
        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <Text>
            Don't have an account?
            <Text
              onPress={() => navigation.navigate('Signup')}
              style={{color: '#aa8453'}}>
              {' '}
              Click here
            </Text>
          </Text>
        </View>
        <Text
          onPress={() => navigation.navigate('HomeScreen')}
          style={{
            color: '#aa8453',
            marginTop: 20,
            textDecorationLine: 'underline',
          }}>
          Go to Home Page
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  innerbox: {
    height: '50%',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#f1eae1',
    flexDirection: 'column',
    gap: 80,
  },
  inputstyle: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    borderRadius: 0,
  },
  signinbtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'black',
    color: 'white',
    width: '23%',
    borderRadius: 5,
  },
});
