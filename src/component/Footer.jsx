import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native"; // only if you have navigation

const Footer = () => {
  const navigation = useNavigation();

  return (
    <>
      {/* Top Footer */}
      <View style={styles.footer}>
        <View style={styles.grid}>
          {/* Logo + Description + Socials */}
          <View style={styles.column}>
            <Image
              source={require("../../public/logo.png")} // adjust path or use { uri: "https://..." }
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.description}>
              When it comes to the world of real estate, a good company stands
              out from the rest by redefining excellence in every aspect of its
              operations.
            </Text>

            <View style={styles.socialRow}>
              <TouchableOpacity onPress={() => Linking.openURL("https://facebook.com")}>
                <Icon name="facebook" size={20} color="#ccc" style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL("https://twitter.com")}>
                <Icon name="twitter" size={20} color="#ccc" style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL("https://linkedin.com")}>
                <Icon name="linkedin" size={20} color="#ccc" style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL("https://plus.google.com")}>
                <Icon name="google-plus" size={20} color="#ccc" style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL("https://pinterest.com")}>
                <Icon name="pinterest" size={20} color="#ccc" style={styles.socialIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.column}>
            <Text style={styles.heading}>Contact Info</Text>
            <Text style={styles.text}>
              Uniland Agency 301 The Greenhouse, Custard Factory, London, E3 8DY.
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL("tel:+12463450695")}>
              <Text style={styles.link}>+1 246-345-0695</Text>
            </TouchableOpacity>
            <Text style={styles.text}>helpline@uniland.com</Text>
          </View>

          {/* Quick Links */}
          <View style={styles.column}>
            <Text style={styles.heading}>Quick Links</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Ourservices')}>
              <Text style={styles.link}>Our Services</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Ourmission")}>
              <Text style={styles.link}>Our Mission</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Timeline")}>
              <Text style={styles.link}>Timeline</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("About")}>
              <Text style={styles.link}>About</Text>
            </TouchableOpacity>
          </View>

          {/* Appointment */}
          <View style={styles.column}>
            <Text style={styles.heading}>Appointment</Text>
            <Text style={styles.text}>
              The process for scheduling appointments, whether it's through
              phone calls, emails, online booking systems, or
              appointment-setting apps.
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>©2025 Uniland All rights reserved</Text>
        <View style={styles.bottomLinks}>
          <TouchableOpacity>
            <Text style={styles.link}>Privacy & Policy</Text>
          </TouchableOpacity>
          <Text style={styles.bottomText}>|</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Site Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#000",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  column: {
    width: "45%", // 2 per row on phones
    marginBottom: 20,
  },
  logo: {
    height: 48,
    width: 160,
    marginBottom: 12,
  },
  description: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 18,
  },
  socialRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  socialIcon: {
    marginRight: 12,
  },
  heading: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  text: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 4,
  },
  link: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 6,
  },
  bottomBar: {
    backgroundColor: "#111",
    borderTopWidth: 0.5,
    borderTopColor: "#444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  bottomText: {
    color: "#aaa",
    fontSize: 12,
  },
  bottomLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
});
