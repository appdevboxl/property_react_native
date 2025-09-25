import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const AdminHeader = () => {
  const navigation = useNavigation();
  const [showLogout, setShowLogout] = React.useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>setShowLogout(!showLogout)}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/17/17004.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
      </TouchableOpacity>
            
            <Text>  Hello, <Text style={{ fontWeight: 'bold' }}>Admin</Text> </Text>
            <View style={{position:'absolute', right:50, top:40, cursor:'pointer',padding:5,backgroundColor:"#fff", borderRadius:5, borderWidth:1, borderColor:'#ccc',zIndex:100,display: showLogout ? 'flex' : 'none'}}>
              <Pressable onPress={()=>{

                navigation.navigate('Login');
              }}>
                <Text style={{color:'red', fontWeight:'bold'}}>Logout</Text>
              </Pressable>

            </View>
    </View>
  )
}

export default AdminHeader

const styles = StyleSheet.create({
  logo:{
    width:40,
    height:30,
},
container:{
  flexDirection:'row',
  justifyContent:'flex-end',
  alignItems:'center',
  padding:10,
  backgroundColor:'#f0f0f0',
  borderBlockEndColor:'#ccc',
  borderBottomWidth:1,
}
})