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
  Modal,
  TextInput,
} from 'react-native';
import Navbar from './Navbar';
import mydata from '../../utils/data';
import {Picker} from '@react-native-picker/picker';

const BASE_URL = 'http://' + mydata.BASE_URL;

// Utility: strip HTML
const stripHtml = html => (html ? html.replace(/<[^>]*>?/gm, '') : '');

const ViewProperty = ({route, navigation}) => {
  const {id} = route.params;
  const [mylocation, setmylocation] = useState('N/A');
  const [property, setProperty] = useState(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // Modal form state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_no: '',
    message: '',
    // location: mylocation,
    property: id,
  });
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');


  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/admin/getproperties/${id}`);
      if (!res.ok) throw new Error('Failed to fetch property details');
      const data = await res.json();
      console.log(data)
      setProperty(data.myproperty || data);
      // setmylocation(data.myproperty.location);
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

  // const fetchLocations = async () => {
  //   try {
  //     const res = await fetch(`${BASE_URL}/api/admin/location`);
  //     const data = await res.json();
  //     setLocations(data.locations || []);
  //   } catch (err) {
  //     console.error('Error fetching locations:', err);
  //   }
  // };

  useEffect(() => {
    fetchProperty();
    fetchBanks();
    // fetchLocations();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (field === 'mobile_no') {
      if (!/^\d{10}$/.test(value)) {
        setMobileError('Enter a valid 10-digit mobile number');
      } else {
        setMobileError('');
      }
    }
    if (field === 'email') {
      if (
        value &&
        !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value.toLowerCase())
      ) {
        setEmailError('Enter a valid email');
      } else {
        setEmailError('');
      }
    }
  };

  const onSubmit = async () => {
    if (mobileError || emailError) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/property/interested`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...formData, propertyId: id}),
      });
      const data = await res.json();
      console.log('Submitted:', data);
      setShowModal(false);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !property) {
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

        {/* Title & Interested */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{property.title || 'Untitled'}</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text style={styles.interestedBtn}>Interested</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          {property.address || ''}, {property.location || ''}
        </Text>

        {/* Price */}
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
        {property.amenities?.length ? (
          property.amenities.map((item, i) => (
            <Text key={i} style={styles.listItem}>
              • {item}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyText}>No amenities</Text>
        )}

        {/* Gallery */}
        <Text style={styles.sectionTitle}>Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {property.prop_images?.length ? (
            property.prop_images.map((img, i) => (
              <Image
                key={i}
                source={{uri: `${BASE_URL}/${img}`}}
                style={styles.galleryImage}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No images</Text>
          )}
        </ScrollView>

        {/* Banks */}
        <Text style={styles.sectionTitle}>Approved Banks</Text>
        {banks.length ? (
          banks.map((b, i) => (
            <View key={i} style={styles.bankRow}>
              {b.file && (
                <Image
                  source={{uri: `${BASE_URL}/uploads/${b.file}`}}
                  style={styles.bankLogo}
                />
              )}
              <Text style={styles.bankText}>
                {b.bank} - ROI: {b.ROI}%
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No banks available</Text>
        )}

        {/* Video */}
        {property.video_url && (
          <>
            <Text style={styles.sectionTitle}>Video Tour</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(property.video_url)}>
              <Text style={styles.link}>{property.video_url}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Book Agent */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BookAgent', {id})}>
          <Text style={styles.buttonText}>Book an Agent</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{alignSelf: 'flex-end'}}>
              <Text style={{fontSize: 24}}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Schedule a Call</Text>

            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={formData.name}
              onChangeText={t => handleChange('name', t)}
            />

            <TextInput
              style={[
                styles.input,
                mobileError && {borderColor: 'red', borderWidth: 1},
              ]}
              placeholder="Mobile No"
              keyboardType="numeric"
              maxLength={10}
              value={formData.mobile_no}
              onChangeText={t => handleChange('mobile_no', t)}
            />
            {mobileError ? (
              <Text style={{color: 'red'}}>{mobileError}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={t => handleChange('email', t)}
            />
            {emailError ? (
              <Text style={{color: 'red'}}>{emailError}</Text>
            ) : null}


            <View>
              <Text>Message</Text>
              <TextInput
                style={[styles.textarea, {height: 100}]}
                multiline
                numberOfLines={4}
                value={formData.message}
                onChangeText={text => handleChange('message', text)}
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// --- styles ---
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 16},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  coverImage: {width: '100%', height: 220, borderRadius: 10, marginBottom: 12},
  headerRow: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
  listItem: {fontSize: 15, color: '#555'},
  emptyText: {fontSize: 14, color: '#999'},
  galleryImage: {width: 150, height: 100, borderRadius: 8, marginRight: 8},
  bankRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  bankLogo: {width: 40, height: 40, marginRight: 10},
  bankText: {fontSize: 15, color: '#444'},
  link: {color: '#0066cc', textDecorationLine: 'underline'},
  button: {
    marginVertical: 30,
    padding: 12,
    backgroundColor: '#aa8453',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  interestedBtn: {
    backgroundColor: '#aa8453',
    color: '#fff',
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#aa8453',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 30,
  },
  submitText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  textarea: {
    borderWidth: 0.2,
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default ViewProperty;
