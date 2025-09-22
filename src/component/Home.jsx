// src/component/Home.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";

import Entypo from "react-native-vector-icons/Entypo";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
import Footer from "./Footer"; // optional — if you have a native Footer component

const { width } = Dimensions.get("window");

const tabsData = [
  { id: "deluxe", label: "Deluxe Portion" },
  { id: "garden", label: "Garden House" },
  { id: "double", label: "Double Room" },
];

const stats = [
  { label: "Listed Property", value: "310" },
  { label: "Mega Projects", value: "51" },
  { label: "Awards Won", value: "25" },
  { label: "Happy Clients", value: "2130" },
];

const services = [
  { id: "buy", title: "Buy a Home", desc: "Important steps & considerations" },
  { id: "development", title: "Development", desc: "Infrastructure & planning" },
  { id: "selling", title: "Selling and Rental", desc: "Market & listing support" },
];

const amenities = [
  { id: "parking", label: "Parking Space", icon: "car" },
  { id: "pool", label: "Swimming Pool", icon: "swimmer" },
  { id: "security", label: "Private Security", icon: "user-shield" },
  { id: "medical", label: "Medical Center", icon: "hospital" },
  { id: "library", label: "Library Area", icon: "book" },
  { id: "beds", label: "King Size Beds", icon: "bed" },
  { id: "smart", label: "Smart Homes", icon: "home" },
  { id: "play", label: "Kid’s Playland", icon: "child" },
];

const Home = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("deluxe");

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 0 }}>
      <Navbar />
      <Carousel />

      {/* About / Hero Section */}
      <View style={styles.section}>
        <View style={styles.left}>
          <Image
            source={require("../../public/real-estate-template-13.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.right}>
          <Text style={styles.badge}>ABOUT US</Text>
          <Text style={styles.heading}>The Leading Real Estate Rental Marketplace</Text>
          <Text style={styles.paragraph}>
            Our 30,000 people work for us in more than 70 countries all over the
            world. This breadth of global coverage, combined with specialist services...
          </Text>

          <View style={styles.featureGrid}>
            <View style={styles.featureRow}>
              <Icon name="home" size={14} color="#cda476ff" style={styles.featureIcon} />
              <Text style={styles.featureText}>Smart Home Design</Text>
            </View>
            <View style={styles.featureRow}>
              <Icon name="leaf" size={14} color="#cda476ff" style={styles.featureIcon} />
              <Text style={styles.featureText}>Beautiful Scene Around</Text>
            </View>
            <View style={styles.featureRow}>
              <Icon name="couch" size={14} color="#cda476ff" style={styles.featureIcon} />
              <Text style={styles.featureText}>Exceptional Lifestyle</Text>
            </View>
            <View style={styles.featureRow}>
              <Icon name="shield-alt" size={14} color="#cda476ff" style={styles.featureIcon} />
              <Text style={styles.featureText}>Complete 24/7 Security</Text>
            </View>
          </View>

          <Text style={styles.quote}>
            Where we believe in more than just selling properties – we envision a future
            where every individual's dreams of owning a home, securing an investment,
            or finding the perfect commercial space come true.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Browse")}
          >
            <Text style={styles.primaryButtonText}>Our Services</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statBox}>
            <Text style={styles.statNumber}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Trending / Top selling */}
      <View style={styles.trendingSection}>
        <View style={styles.trendingLeft}>
          <View style={styles.trendingBadge}>
             <Text style={styles.badge}>Trending</Text>
          </View>
          <Text style={styles.trendingTitle}>Recent Top Selling Apartment</Text>
          <Text style={styles.trendingParagraph}>
            Houzez allows you to design unlimited panels and real estate custom
            forms to capture leads and keep record of all information.
          </Text>

          <View style={styles.specsRow}>
            <View style={styles.spec}>
              <Text style={styles.specNumber}>3</Text>
              <Text style={styles.specLabel}>Bedrooms</Text>
            </View>
            <View style={styles.spec}>
              <Text style={styles.specNumber}>2</Text>
              <Text style={styles.specLabel}>Bathrooms</Text>
            </View>
            <View style={styles.spec}>
              <Text style={styles.specNumber}>2</Text>
              <Text style={styles.specLabel}>Car Parking</Text>
            </View>
            <View style={styles.spec}>
              <Text style={styles.specNumber}>3450</Text>
              <Text style={styles.specLabel}>Square Ft</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.soldLabel}>Sold Price:</Text>
            <Text style={styles.priceValue}>₹5,00,00,000 <Text style={styles.priceNote}>Onwards</Text></Text>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("BrowseTab")}
          >
            <Text style={styles.secondaryButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trendingRight}>
          <Image
            source={require("../../public/assets/images/realator-template-13.png")}
            style={styles.trendingImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Small Services Cards */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Main Focus</Text>
        <Text style={styles.sectionSubtitle}>Selling a property is not just about placing a sign — we make it work.</Text>
      </View>

      <View style={styles.cardsGrid}>
        {services.map((svc) => (
          <View key={svc.id} style={styles.card}>
            <View style={styles.cardIconWrap}>
              <AntDesign name="appstore1" size={28} />
            </View>
            <Text style={styles.cardTitle}>{svc.title}</Text>
            <Text style={styles.cardDesc}>{svc.desc}</Text>
            <TouchableOpacity style={styles.cardLink} onPress={() => navigation.navigate("Browse")}>
              <Text style={styles.cardLinkText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Tabs - Apartment Plan Preview */}
      <View style={styles.previewSection}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewBadge}>Apartment Sketch</Text>
          <Text style={styles.previewTitle}>Apartments Plan Preview</Text>
        </View>

        <View style={styles.tabList}>
          {tabsData.map((t) => (
            <TouchableOpacity
              key={t.id}
              onPress={() => setActiveTab(t.id)}
              style={[styles.tabButton, activeTab === t.id && styles.tabButtonActive]}
            >
              <Text style={[styles.tabButtonText, activeTab === t.id && styles.tabButtonTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === "deluxe" && (
            <View style={styles.planRow}>
              <View style={styles.planBox}>
                <Text style={styles.planTitle}>Deluxe Portion</Text>
                <Text style={styles.planText}>
                  Enimad minim veniam quis nostrud exercitation ullamco laboris.
                </Text>
                <View style={styles.planList}>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Total Area</Text><Text style={styles.planListText}>2800 Sq. Ft</Text></View>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Bedroom</Text><Text style={styles.planListText}>150 Sq. Ft</Text></View>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Bathroom</Text><Text style={styles.planListText}>45 Sq. Ft</Text></View>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Balcony/Pets</Text><Text style={styles.planListText}>Allowed</Text></View>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Lounge</Text><Text style={styles.planListText}>650 Sq. Ft</Text></View>
                </View>
              </View>
              <Image
                source={require("../../public/assets/images/clipart/17.png")}
                style={styles.planImage}
                resizeMode="contain"
              />
            </View>
          )}

          {activeTab === "garden" && (
            <View style={styles.planRow}>
              <View style={styles.planBox}>
                <Text style={styles.planTitle}>Garden House</Text>
                <Text style={styles.planText}>Enimad minim veniam quis nostrud exercitation ullamco laboris.</Text>
                <View style={styles.planList}>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Total Area</Text><Text style={styles.planListText}>2800 Sq. Ft</Text></View>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Bedroom</Text><Text style={styles.planListText}>150 Sq. Ft</Text></View>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Bathroom</Text><Text style={styles.planListText}>45 Sq. Ft</Text></View>
                </View>
              </View>
              <Image
                source={require("../../public/real-estate-template-13.png")}
                style={styles.planImage}
                resizeMode="contain"
              />
            </View>
          )}

          {activeTab === "double" && (
            <View style={styles.planRow}>
              <View style={styles.planBox}>
                <Text style={styles.planTitle}>Double Room</Text>
                <Text style={styles.planText}>Enimad minim veniam quis nostrud exercitation ullamco laboris.</Text>
                <View style={styles.planList}>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Total Area</Text><Text style={styles.planListText}>2800 Sq. Ft</Text></View>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Bedroom</Text><Text style={styles.planListText}>150 Sq. Ft</Text></View>
                  <View style={styles.planListRow}><Text style={styles.planListText}>Bathroom</Text><Text style={styles.planListText}>45 Sq. Ft</Text></View>
                </View>
              </View>
              <Image
                source={require("../../public/real-estate-template-13.png")}
                style={styles.planImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </View>

      {/* Amenities */}
      <View style={styles.amenitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Amenities</Text>
          <Text style={styles.sectionSubtitle}>Building Amenities</Text>
        </View>

        <View style={styles.amenitiesGrid}>
          {amenities.map((a) => (
            <View key={a.id} style={styles.amenityCard}>
              <View style={styles.amenityIcon}>
                <Icon name={a.icon} size={22} />
              </View>
              <Text style={styles.amenityLabel}>{a.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Optional Footer (native) */}
      <Footer/> 
    </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { flexDirection: width > 700 ? "row" : "column", padding: 16, gap: 12 },
  left: { flex: 1, alignItems: "center", justifyContent: "center" },
  right: { flex: 1 },
  heroImage: { width: width > 700 ? "100%" : "95%", height: '500', borderRadius: 12 },
  badge: {
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#1f2937",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    // borderRadius: 4,
    overflow: "hidden",
    colorScheme: "dark",
  },
  heading: { fontSize: 22, fontWeight: "bold", marginTop: 8 },
  paragraph: { marginTop: 8, color: "#555" },
  featureGrid: { marginTop: 12, flexWrap: "wrap", flexDirection: "row", gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", width: "50%", marginBottom: 6 },
  featureIcon: { marginRight: 8 },
  featureText: { color: "#333" },
  quote: { backgroundColor: "#f3f4f6", padding: 12, marginTop: 12, fontSize: 15 },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#aa8453",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  primaryButtonText: { color: "#fff", fontWeight: "bold" },

  statsSection: {
    flexDirection: "row",
    flexWrap: "wrap",       // allow wrapping to next row
    justifyContent: "center", 
    
  },
  statBox: {
    width: "45%",           // ~2 per row with spacing
    margin: 5,
    alignItems: "center",
    padding: 10,

    borderRadius: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },


  trendingSection: {
    flexDirection: width > 800 ? "row" : "column",
    padding: 16,
    gap: 12,
    alignItems: "center",
  },
  trendingLeft: { flex: 1 },
  trendingRight: { flex: 1, alignItems: "center" },
  trendingBadge: { backgroundColor: "#333", padding: 2, alignSelf: "flex-start", borderRadius: 0 },
  trendingBadgeText: { color: "#fff", fontSize: 12 },
  trendingTitle: { fontSize: 20, fontWeight: "700", marginTop: 8 },
  trendingParagraph: { color: "#444", marginTop: 6 },
  specsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
  spec: { width: "50%", paddingVertical: 6 },
  specNumber: { fontWeight: "700", fontSize: 18 },
  specLabel: { color: "#666" },
  priceRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginTop: 12 },
  soldLabel: { color: "#333" },
  priceValue: { color: "#aa8453", fontSize: 20, fontWeight: "700" },
  priceNote: { fontSize: 12, color: "#666", fontWeight: "400" },

  secondaryButton: {
    marginTop: 14,
    backgroundColor: "#aa8453",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  secondaryButtonText: { color: "#fff", fontWeight: "700" },

  sectionHeader: { paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  sectionSubtitle: { color: "#666", marginTop: 6 },

  cardsGrid: { flexDirection: "row", justifyContent: "space-between", padding: 16, gap: 12 },
  card: { flex: 1, backgroundColor: "#fff", padding: 12, marginRight: 8, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.05, elevation: 2 },
  cardIconWrap: { marginBottom: 10 },
  cardTitle: { fontWeight: "700", fontSize: 16 },
  cardDesc: { color: "#666", marginTop: 6 },
  cardLink: { marginTop: 8 },
  cardLinkText: { color: "#aa8453", fontWeight: "700" },

  previewSection: { padding: 16 },
  previewHeader: { alignItems: "center", marginBottom: 12 },
  previewBadge: { backgroundColor: "#333", color: "#fff", padding: 6, borderRadius: 0, overflow: "hidden", colorScheme: "dark" },
  previewTitle: { fontSize: 20, fontWeight: "700", marginTop: 8 },

  tabList: { flexDirection: "row", justifyContent: "center", marginVertical: 12 },
  tabButton: { paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 6 },
  tabButtonActive: { borderBottomWidth: 2, borderBottomColor: "#aa8453" },
  tabButtonText: { color: "#666" },
  tabButtonTextActive: { color: "#aa8453", fontWeight: "700" },

  tabContent: { paddingVertical: 8 },
  planRow: { flexDirection: width > 700 ? "row" : "column", gap: 12, alignItems: "center" },
  planBox: { flex: 1, backgroundColor: "#aa8453", padding: 16, borderRadius: 10 },
  planTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  planText: { color: "#fff", marginTop: 8 },
  planList: { marginTop: 12 ,  borderRadius: 6, padding: 8 },
  planListRow: { flexDirection: "row",color: "white", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 0.5, borderTopColor: "rgba(255,255,255,0.2)" },
  planImage: { flex: 1, width: width > 700 ? 280 : 300, height: 380 },
  planListText: {
    color: "white",
  },
  amenitiesSection: { padding: 16 },
  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  amenityCard: { width: "48%", backgroundColor: "#fff", padding: 14, marginBottom: 12, borderRadius: 8, alignItems: "center" },
  amenityIcon: { marginBottom: 8 },
  amenityLabel: { color: "#333", textAlign: "center" },

  trendingImage: { width: width > 700 ? 320 : 400, height: 320, borderRadius: 0 ,paddingHorizontal:10},
});
