import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Navbar = () => {
    return (
        <View style={styles.nav}>
            <Image
                source={require("../../public/logo.png")}
                style={[styles.img, { width: '50%', height: '70%' }]}
            />
        </View>
    )
}

export default Navbar

const styles = StyleSheet.create({
    nav: {
        backgroundColor: 'black',
        height: 70,

    },
    img: {
        marginVertical: 10,
        marginHorizontal: 20,
    }
})