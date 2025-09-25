import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Linking,
} from "react-native";
import Navbar from "./Navbar";
import Footer from "./Footer";
import mydata from '../../utils/data'

const Compare = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProperty();
  }, []);

  const getProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://10.0.2.2:3000/api/admin/getcompareprop"); // use 10.0.2.2 for Android emulator
      const data = await response.json();

      if (data.success) {
        setProperties(data.mycompare.properties || []);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      ToastAndroid.show("Failed to fetch properties", ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    try {
      const response = await fetch(
        `http://${mydata.BASE_URL}/api/admin/removecompare/${propertyId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        ToastAndroid.show("Property removed", ToastAndroid.SHORT);
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      } else {
        ToastAndroid.show(data.message || "Failed to remove", ToastAndroid.LONG);
      }
    } catch (error) {
      console.error("Error removing property:", error);
      ToastAndroid.show("Error removing property", ToastAndroid.LONG);
    }
  };

  const renderRow = (label, renderValue) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {properties.map((p) => (
        <View key={p._id} style={styles.cell}>
          {renderValue(p)}
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Compare Properties</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#aa8453" />
        ) : properties.length === 0 ? (
          <Text style={styles.emptyText}>No properties to compare.</Text>
        ) : (
          <ScrollView horizontal>
            <View>
              {/* Header Row */}
              <View style={styles.row}>
                <Text style={styles.label}>Feature</Text>
                {properties.map((prop) => (
                  <View key={prop._id} style={styles.cell}>
                    <Text style={[styles.title,{textTransform:'capitalize'}]}>{prop.title}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveProperty(prop._id)}
                      style={styles.removeBtn}
                    >
                      <Text style={styles.removeText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Property Rows */}
              {renderRow("Image", (p) => (
                <Image
                  source={{ uri: `http://${mydata.BASE_URL}/${p.frontimage}` || "https://via.placeholder.com/150" }}
                  style={styles.image}
                />
              ))}

              {renderRow("Builder Name", (p) => <Text style={{textTransform:'capitalize'}}>{p.builder_name || "N/A"}</Text>)}
              {renderRow("Type", (p) => <Text>{p.property_type || "N/A"}</Text>)}
              {renderRow("Status", (p) => <Text>{p.property_status || "N/A"}</Text>)}
              {renderRow("For", (p) => <Text>{p.property_for || "N/A"}</Text>)}
              {renderRow("Location", (p) => <Text style={{textTransform:'capitalize'}}>{p.location || "N/A"}</Text>)}
              {renderRow("Price Range", (p) => (
                <Text>{p.price_from_words} - {p.price_to_words}</Text>
              ))}
              {renderRow("Area", (p) => (
                <Text>{p.area_from} - {p.area_to} sq.ft.</Text>
              ))}
              {renderRow("Construction Year", (p) => <Text>{p.construction_year || "N/A"}</Text>)}

              {renderRow("Amenities", (p) =>
                p.amenities?.length ? (
                  <View>
                    {p.amenities.map((a, idx) => (
                      <Text key={idx}>✔ {a}</Text>
                    ))}
                  </View>
                ) : (
                  <Text>No amenities</Text>
                )
              )}

              {renderRow("Nearby Places", (p) =>
                p.nearbyPlaces?.length ? (
                  <View>
                    {p.nearbyPlaces.map((n, idx) => (
                      <Text key={idx}>{n.place} - {n.distance}</Text>
                    ))}
                  </View>
                ) : (
                  <Text>No nearby places</Text>
                )
              )}

              {renderRow("Video Tour", (p) =>
                p.video_url ? (
                  <TouchableOpacity onPress={() => Linking.openURL(p.video_url)}>
                    <Text style={styles.link}>Watch Video</Text>
                  </TouchableOpacity>
                ) : (
                  <Text>No video</Text>
                )
              )}
            </View>
          </ScrollView>
        )}
      </ScrollView>

    </View>
  );
};

export default Compare;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    alignItems: "center",
  },
  label: {
    width: 120,
    fontWeight: "600",
    color: "#444",
  },
  cell: {
    width: 150,
    alignItems: "center",
    padding: 5,
    position: "relative",
  },
  title: {
    fontWeight: "600",
    color: "#aa8453",
  },
  removeBtn: {
    position: "absolute",
    top: 0,
    right: 5,
  },
  removeText: {
    fontSize: 20,
    color: "red",
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 8,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
