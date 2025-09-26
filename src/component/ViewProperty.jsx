import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Navbar from './Navbar';
import mydata from '../../utils/data'
const BASE_URL = 'http://' + mydata.BASE_URL; 

// Utility: strip HTML
const stripHtml = html => {
  return html ? html.replace(/<[^>]*>?/gm, '') : '';
};

const ViewProperty = ({route, navigation}) => {
  const {id} = route.params; // property id from navigation
  const [property, setProperty] = useState(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/admin/getproperties/${id}`);
      if (!res.ok) throw new Error('Failed to fetch property details');

      const data = await res.json();
      setProperty(data.myproperty || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/banks`);
      const data = await res.json();
      setBanks(data.mybank || []);
    } catch (err) {
      console.error('Error fetching banks:', err);
    }
  };

  useEffect(() => {
    fetchProperty();
    fetchBanks();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#aa8453" />
        <Text>Loading property details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{color: 'red'}}>⚠️ {error}</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.center}>
        <Text>Property not found</Text>
      </View>
    );
  }

  return (
    <>
      <Navbar />
      <ScrollView style={styles.container}>
        {/* Cover Image */}
        {property.frontimage ? (
          <Image
            source={{uri: `${BASE_URL}/${property.frontimage}`}}
            style={styles.coverImage}
          />
        ) : null}

        {/* Title & Address */}
        <Text style={styles.title}>
          {property.title || 'Untitled Property'}
        </Text>
        <Text style={styles.subtitle}>
          {property.address || ''}, {property.location || ''}
        </Text>

        {/* Price & Status */}
        <Text style={styles.price}>
          ₹{property.price ? property.price.toLocaleString('en-IN') : 'N/A'}
        </Text>
        <Text style={styles.status}>{property.property_status || ''}</Text>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {stripHtml(property.description) || 'No description available.'}
        </Text>

        {/* Amenities */}
        <Text style={styles.sectionTitle}>Features & Amenities</Text>
        {property.amenities && property.amenities.length > 0 ? (
          property.amenities.map((item, i) => (
            <Text key={i} style={styles.listItem}>
              • {item}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyText}>No amenities available</Text>
        )}

        {/* Gallery */}
        <Text style={styles.sectionTitle}>Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 8}}>
          {(property.prop_images && property.prop_images.length > 0) ? (
            property.prop_images.map((item, index) => (
              <Image
                key={index}
                source={{uri: `${BASE_URL}/${item}`}}
                style={styles.galleryImage}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No images available</Text>
          )}
        </ScrollView>

        {/* Key Details */}
        <Text style={styles.sectionTitle}>Key Details</Text>
        <DetailRow label="Property ID" value={property._id || 'N/A'} />
        <DetailRow label="Builder" value={property.builder_name || 'N/A'} />
        <DetailRow
          label="Year Built"
          value={property.construction_year || 'N/A'}
        />
        <DetailRow
          label="BHK Types"
          value={property.bhkTypes ? property.bhkTypes.join(', ') : 'N/A'}
        />
        <DetailRow
          label="Listing Status"
          value={property.listing_status || 'N/A'}
        />

        {/* Nearby Places */}
        <Text style={styles.sectionTitle}>Nearby Places</Text>
        {property.nearbyPlaces && property.nearbyPlaces.length > 0 ? (
          property.nearbyPlaces.map((place, i) => (
            <DetailRow
              key={i}
              label={place.place || 'Unknown place'}
              value={place.distance || 'N/A'}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No nearby places available</Text>
        )}

        {/* Banks */}
        <Text style={styles.sectionTitle}>Approved Banks</Text>
        {banks.length > 0 ? (
          banks.map((bank, i) => (
            <View key={i} style={styles.bankRow}>
              {bank.file ? (
                <Image
                  source={{uri: `${BASE_URL}/uploads/${bank.file}`}}
                  style={styles.bankLogo}
                />
              ) : null}
              <Text style={styles.bankText}>
                {bank.bank} - ROI: {bank.ROI}%
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No banks available</Text>
        )}

        {/* Video URL */}
        {property.video_url ? (
          <>
            <Text style={styles.sectionTitle}>Video Tour</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(property.video_url)}>
              <Text style={styles.link}>{property.video_url}</Text>
            </TouchableOpacity>
          </>
        ) : null}

        {/* Book Agent Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BookAgent', {id})}>
          <Text style={styles.buttonText}>Book an Agent</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const DetailRow = ({label, value}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 16},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  coverImage: {width: '100%', height: 220, borderRadius: 10, marginBottom: 12},
  title: {fontSize: 24, fontWeight: 'bold', color: '#333'},
  subtitle: {fontSize: 16, color: '#666', marginBottom: 6},
  price: {fontSize: 22, fontWeight: 'bold', color: '#aa8453'},
  status: {fontSize: 16, color: '#444', marginBottom: 16},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  description: {fontSize: 15, lineHeight: 22, color: '#444'},
  listItem: {fontSize: 15, color: '#555', marginVertical: 2},
  emptyText: {fontSize: 14, color: '#999', marginVertical: 4},
  galleryImage: {width: 150, height: 100, borderRadius: 8, marginRight: 8},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    paddingVertical: 6,
  },
  detailLabel: {fontSize: 15, color: '#555'},
  detailValue: {fontSize: 15, fontWeight: '600', color: '#333'},
  bankRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  bankLogo: {width: 40, height: 40, marginRight: 10},
  bankText: {fontSize: 15, color: '#444'},
  link: {color: '#0066cc', textDecorationLine: 'underline'},
  button: {
    marginTop: 20,
    marginBottom: 30,
    padding: 12,
    backgroundColor: '#aa8453',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

export default ViewProperty;
