import {Image, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Left logo */}
      <Image
        source={require('../../public/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Right login icon */}
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Image
          source={require('../../public/loginicon.png')}
          style={styles.loginIcon}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
    height: 70,
    paddingHorizontal: 15,
  },
  logo: {
    width: 120,
    height: 80,
  },
  loginIcon: {
    width: 30,
    height: 30,
  },
});
