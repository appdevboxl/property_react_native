import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import mydata from '../../utils/data'
// import EncryptedStorage from 'react-native-encrypted-storage';
const Login = ({navigation}) => {
  //   const mnavigation = useNavigation();
  // const storage = new MMKV();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async () => {
    const {email, password} = formData;
    const userData = {email, password};

//     await EncryptedStorage.setItem('user_session', JSON.stringify({
//   age: 21,
//   token: 'ACCESS_TOKEN',
//   username: 'emeraldsanto',
// }));
// console.log(await EncryptedStorage.getItem('user_session'));
    try {
      const response = await fetch(
        `http://${mydata.BASE_URL}/api/auth/login`,
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
        Alert.alert('Success', data.message || 'User successfully logged in');
        setFormData({
          email: '',
          password: '',
        });
        // storage.set('token', data.token);
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', data.message || 'Login failed!');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../public/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.innerbox}>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <Text style={{fontSize: 25, fontWeight: '700', marginBottom: 20}}>
            User Login
          </Text>
        </View>
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
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.signinbtn}>Sign In</Text>
          </TouchableOpacity>
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
          onPress={() => navigation.navigate('HomeTab')}
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
    backgroundColor: '#cfc8beff',
    flexDirection: 'column',
    gap: 0,
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
  logo: {
    width: 120,
    height: 80,
    alignSelf: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
});
