// EditProperty.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import mydata from '../../utils/data'; // your BASE_URL file
import data from '../../utils/data'; // if you have config lists in same file (property_types, etc.)
import Navbar from './Navbar';
import AdminHeader from './AdminHeader';

const EditProperty = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params || {}; // ensure id passed in navigation
  const [formData, setFormData] = useState({});
  const [banks, setBanks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([{place: '', distance: ''}]);
  const [frontImage, setFrontImage] = useState(null); // { uri, fileName, type, fileSize }
  const [propertyImages, setPropertyImages] = useState([]); // array of images { uri, fileName, type, fileSize }
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // ---------- Permissions helpers (Android) ----------
  const checkStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const androidVersion = Platform.Version;
      const permission =
        androidVersion >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const has = await PermissionsAndroid.check(permission);
      if (has) return true;
      const granted = await PermissionsAndroid.request(permission);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

// console.log(formData)

  // ---------- Fetch initial data ----------
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = `http://${mydata.BASE_URL}`;

        // Property details
        const propRes = await fetch(`${base}/api/admin/getproperties/${id}`);
        const propJson = await propRes.json();
        if (propJson && propJson.myproperty && mounted) {
          setFormData(propJson.myproperty);
          if (
            Array.isArray(propJson.myproperty.nearbyPlaces) &&
            propJson.myproperty.nearbyPlaces.length > 0
          ) {
            setNearbyPlaces(propJson.myproperty.nearbyPlaces);
          }
        }

        // Locations
        const locRes = await fetch(`${base}/api/admin/getlocation`);
        const locJson = await locRes.json();
        if (locJson && Array.isArray(locJson.mylocation) && mounted) {
          setLocations(locJson.mylocation);
        }

        // Banks
        const bankRes = await fetch(`${base}/api/admin/banks`);
        const bankJson = await bankRes.json();
        if (bankJson && Array.isArray(bankJson.mybank) && mounted) {
          setBanks(bankJson.mybank);
        }

        // Amenities
        const amenRes = await fetch(`${base}/api/admin/amenities`);
        const amenJson = await amenRes.json();
        if (amenJson && Array.isArray(amenJson.myamenity) && mounted) {
          setAmenitiesList(amenJson.myamenity);
        }
      } catch (err) {
        console.error('fetchData error:', err);
        Alert.alert('Error', 'Failed to load property data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const toggleAmenity = amenityValue => {
    const arr = formData.amenities ? [...formData.amenities] : [];
    const idx = arr.indexOf(amenityValue);
    if (idx === -1) arr.push(amenityValue);
    else arr.splice(idx, 1);
    setFormData(prev => ({...prev, amenities: arr}));
  };

  const addNearbyRow = () => {
    setNearbyPlaces(prev => [...prev, {place: '', distance: ''}]);
  };

  const removeNearbyRow = index => {
    setNearbyPlaces(prev => prev.filter((_, i) => i !== index));
  };

  const handleNearbyChange = (index, field, value) => {
    setNearbyPlaces(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const pickFrontImage = async () => {
    const ok = await checkStoragePermission();
    if (!ok) {
      Alert.alert(
        'Permission required',
        'Please allow storage permission to pick images.',
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1600,
      maxHeight: 1600,
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        console.warn('ImagePicker Error:', response.errorMessage);
        Alert.alert('Error', response.errorMessage || 'Image pick error');
        return;
      }
      const asset = response.assets && response.assets[0];
      if (asset) {
        // small validation
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert('Error', 'Image size should be less than 5MB');
          return;
        }
        setFrontImage(asset);
      }
    });
  };

  const pickPropertyImages = async () => {
    const ok = await checkStoragePermission();
    if (!ok) {
      Alert.alert(
        'Permission required',
        'Please allow storage permission to pick images.',
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1600,
      maxHeight: 1600,
      selectionLimit: 10, // multiple images
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.warn('ImagePicker Error:', response.errorMessage);
        Alert.alert('Error', response.errorMessage || 'Image pick error');
        return;
      }
      const assets = response.assets || [];
      const filtered = assets.filter(
        a => !(a.fileSize && a.fileSize > 5 * 1024 * 1024),
      );
      if (filtered.length !== assets.length) {
        Alert.alert(
          'Some images were skipped',
          'One or more images exceeded 5MB and were not added.',
        );
      }
      // Append to existing propertyImages
      setPropertyImages(prev => [...prev, ...filtered]);
    });
  };

  const removePickedPropertyImage = index => {
    setPropertyImages(prev => prev.filter((_, i) => i !== index));
  };

  // ---------- Submit handlers ----------
  // Basic info: PUT with JSON
  const handleBasicInfoSubmit = async () => {
    setLoading(true);
    try {
      const base = `http://${mydata.BASE_URL}`;
      const payload = {
        title: formData.title,
        builder_name: formData.builder_name,
        description: formData.description,
        property_type: formData.property_type,
        property_status: formData.property_status,
        location: formData.location,
        price: formData.price,
        area_from: formData.area_from,
        area_to: formData.area_to,
        price_from_words: formData.price_from_words,
        price_to_words: formData.price_to_words,
        price_from_number: formData.price_from_number,
        price_to_number: formData.price_to_number,
        address: formData.address,
        video_url: formData.video_url,
        construction_year: formData.construction_year,
        listing_status: formData.listing_status,
      };

      const res = await fetch(`${base}/api/admin/updateproperty/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok) {
        Alert.alert('Success', json.message || 'Basic information updated');
      } else {
        Alert.alert(
          'Error',
          json.message || 'Failed to update basic information',
        );
      }
    } catch (err) {
      console.error('handleBasicInfoSubmit:', err);
      Alert.alert(
        'Error',
        'Something went wrong while updating basic information',
      );
    } finally {
      setLoading(false);
    }
  };

  // Additional info: amenities, bank, bhkTypes
  const handleAdditionalInfoSubmit = async () => {
    setLoading(true);
    try {
      const base = `http://${mydata.BASE_URL}`;
      const payload = {
        amenities: formData.amenities || [],
        bank: formData.bank || '',
        bhkTypes: formData.bhkTypes || '',
      };

      const res = await fetch(`${base}/api/admin/updateproperty/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok) {
        Alert.alert(
          'Success',
          json.message || 'Additional information updated',
        );
      } else {
        Alert.alert(
          'Error',
          json.message || 'Failed to update additional information',
        );
      }
    } catch (err) {
      console.error('handleAdditionalInfoSubmit:', err);
      Alert.alert(
        'Error',
        'Something went wrong while updating additional information',
      );
    } finally {
      setLoading(false);
    }
  };

  // Nearby places submit
  const handleNearbySubmit = async () => {
    setLoading(true);
    try {
      const base = `http://${mydata.BASE_URL}`;
      const res = await fetch(`${base}/api/admin/updateproperty/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nearbyPlaces}),
      });
      const json = await res.json();
      if (res.ok) {
        Alert.alert('Success', json.message || 'Nearby places updated');
      } else {
        Alert.alert('Error', json.message || 'Failed to update nearby places');
      }
    } catch (err) {
      console.error('handleNearbySubmit:', err);
      Alert.alert('Error', 'Something went wrong while updating nearby places');
    } finally {
      setLoading(false);
    }
  };

  // Images submit: FormData multipart
  const handleImageSubmit = async () => {
    // require at least one image selected or frontImage existing
    if (!frontImage && propertyImages.length === 0) {
      Alert.alert(
        'Validation',
        'Please select at least one new image to upload',
      );
      return;
    }
    setUploadingImages(true);
    try {
      const base = `http://${mydata.BASE_URL}`;
      const fd = new FormData();

      if (frontImage) {
        // Note: for Android uri may need 'file://' prefix. react-native-image-picker returns usable uri.
        fd.append('frontimage', {
          uri: frontImage.uri,
          type: frontImage.type || 'image/jpeg',
          name: frontImage.fileName || `front_${Date.now()}.jpg`,
        });
      }

      propertyImages.forEach((img, idx) => {
        fd.append('prop_images', {
          uri: img.uri,
          type: img.type || 'image/jpeg',
          name: img.fileName || `prop_${Date.now()}_${idx}.jpg`,
        });
      });

      const res = await fetch(`${base}/api/admin/edit/property_images/${id}`, {
        method: 'POST',
        headers: {
          // Note: do NOT set Content-Type manually with boundary in RN; leave it unset so RN sets it.
        },
        body: fd,
      });
      const json = await res.json();
      if (res.ok) {
        Alert.alert('Success', json.message || 'Images updated successfully');
        // Clear selected images locally
        setFrontImage(null);
        setPropertyImages([]);
        // Refresh property data (to show new images)
        const propRes = await fetch(`${base}/api/admin/getproperties/${id}`);
        const propJson = await propRes.json();
        if (propJson && propJson.myproperty) {
          setFormData(propJson.myproperty);
        }
      } else {
        Alert.alert('Error', json.message || 'Failed to update images');
      }
    } catch (err) {
      console.error('handleImageSubmit:', err);
      Alert.alert('Error', 'Something went wrong while uploading images');
    } finally {
      setUploadingImages(false);
    }
  };

  // Delete image (existing image on server)
  const handleDeleteImage = imageName => {
    Alert.alert('Confirm', 'Delete this image?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Yes',
        onPress: async () => {
          setLoading(true);
          try {
            const base = `http://${mydata.BASE_URL}`;
            const res = await fetch(`${base}/api/admin/deleteimage/${id}`, {
              method: 'DELETE',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({image: imageName}),
            });
            const json = await res.json();
            if (res.ok) {
              Alert.alert('Success', json.message || 'Image deleted');
              // Update local formData.prop_images to remove the image
              setFormData(prev => ({
                ...prev,
                prop_images: (prev.prop_images || []).filter(
                  img => img !== imageName,
                ),
              }));
            } else {
              Alert.alert('Error', json.message || 'Failed to delete image');
            }
          } catch (err) {
            console.error('handleDeleteImage:', err);
            Alert.alert('Error', 'Something went wrong while deleting image');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // ---------- UI ----------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#aa8453" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <AdminHeader />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Text style={{color: '#333', fontSize: 16}}>Dashboard </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Properties')}>
            <Text style={{color: '#333', fontSize: 16}}>/ Properties</Text>
          </TouchableOpacity>
          <Text style={{color: '#b5895d', fontWeight: 'bold', fontSize: 16}}>
            {' '}
            / Edit Properties
          </Text>
        </View>
        <Text style={styles.heading}>Edit Existing Property</Text>

        {/* Basic Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <Text style={styles.label}>Property Title</Text>
          <TextInput
            style={styles.input}
            value={formData.title || ''}
            onChangeText={t => handleInputChange('title', t)}
            placeholder="Enter Title"
          />

          <Text style={styles.label}>Builder Name</Text>
          <TextInput
            style={styles.input}
            value={formData.builder_name || ''}
            onChangeText={t => handleInputChange('builder_name', t)}
            placeholder="Enter Builder Name"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, {height: 120, textAlignVertical: 'top'}]}
            value={formData.description || ''}
            onChangeText={t => handleInputChange('description', t)}
            placeholder="Description"
            multiline
          />

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.label}>Property Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.property_type || ''}
                  onValueChange={val =>
                    handleInputChange('property_type', val)
                  }>
                  <Picker.Item label="Select Property Type" value="" />
                  {data.property_types?.map((pt, idx) => (
                    <Picker.Item key={idx} label={pt} value={pt} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.label}>Property Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.property_status || ''}
                  onValueChange={val =>
                    handleInputChange('property_status', val)
                  }>
                  <Picker.Item label="Select Status" value="" />
                  {data.property_status_arr?.map((st, idx) => (
                    <Picker.Item key={idx} label={st} value={st} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.location || ''}
                  onValueChange={val => handleInputChange('location', val)}>
                  <Picker.Item label="Select Location" value="" />
                  {locations.map((loc, i) => (
                    <Picker.Item
                      key={i}
                      label={loc.location}
                      value={loc.location}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={formData.price ? String(formData.price) : ''}
                onChangeText={t => handleInputChange('price', t)}
                placeholder="Price"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.label}>Area From (sq ft)</Text>
              <TextInput
                style={styles.input}
                value={formData.area_from ? String(formData.area_from) : ''}
                onChangeText={t => handleInputChange('area_from', t)}
                keyboardType="numeric"
                placeholder="Area from"
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Area To (sq ft)</Text>
              <TextInput
                style={styles.input}
                value={formData.area_to ? String(formData.area_to) : ''}
                onChangeText={t => handleInputChange('area_to', t)}
                keyboardType="numeric"
                placeholder="Area to"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.label}>Price From (words)</Text>
              <TextInput
                style={styles.input}
                value={formData.price_from_words || ''}
                onChangeText={t => handleInputChange('price_from_words', t)}
                placeholder="e.g. Ten Lakh"
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Price To (words)</Text>
              <TextInput
                style={styles.input}
                value={formData.price_to_words || ''}
                onChangeText={t => handleInputChange('price_to_words', t)}
                placeholder="e.g. Twenty Lakh"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.label}>Price From (number)</Text>
              <TextInput
                style={styles.input}
                value={
                  formData.price_from_number
                    ? String(formData.price_from_number)
                    : ''
                }
                onChangeText={t => handleInputChange('price_from_number', t)}
                keyboardType="numeric"
                placeholder="e.g. 1000000"
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Price To (number)</Text>
              <TextInput
                style={styles.input}
                value={
                  formData.price_to_number
                    ? String(formData.price_to_number)
                    : ''
                }
                onChangeText={t => handleInputChange('price_to_number', t)}
                keyboardType="numeric"
                placeholder="e.g. 2000000"
              />
            </View>
          </View>

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={formData.address || ''}
            onChangeText={t => handleInputChange('address', t)}
            placeholder="Address"
          />

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.label}>Video URL</Text>
              <TextInput
                style={styles.input}
                value={formData.video_url || ''}
                onChangeText={t => handleInputChange('video_url', t)}
                placeholder="http://..."
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Construction Year</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.construction_year || ''}
                  onValueChange={val =>
                    handleInputChange('construction_year', val)
                  }>
                  <Picker.Item label="Select Year" value="" />
                  {data.construction_year?.map((yr, idx) => (
                    <Picker.Item key={idx} label={String(yr)} value={yr} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <Text style={styles.label}>Listing Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.listing_status || ''}
              onValueChange={val => handleInputChange('listing_status', val)}>
              <Picker.Item label="Select Listing Status" value="" />
              {data.publish_status_arr?.map((s, idx) => (
                <Picker.Item key={idx} label={s} value={s} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleBasicInfoSubmit}>
            <Text style={styles.buttonText}>Save Information</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <Text style={styles.label}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {amenitiesList.map((a, i) => {
              const val = a.amenities || a; // depending on API shape
              const checked = (formData.amenities || []).includes(val);
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.amenityItem, checked && styles.amenityChecked]}
                  onPress={() => toggleAmenity(val)}>
                  <Text style={{textTransform: 'capitalize'}}>{val}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Select Apartment types (BHK)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={Array.isArray(formData.bhkTypes) ? formData.bhkTypes[0] : formData.bhkTypes || ''}
              onValueChange={val => handleInputChange('bhkTypes', [val])}>
              <Picker.Item label="Select BHK Type" value="" />
              <Picker.Item label="1BHK" value="1BHK" />
              <Picker.Item label="2BHK" value="2BHK" />
              <Picker.Item label="3BHK" value="3BHK" />
              <Picker.Item label="4BHK" value="4BHK" />
              <Picker.Item label="5BHK" value="5BHK" />
              <Picker.Item label="6BHK" value="6BHK" />
            </Picker>
          </View>

          <Text style={styles.label}>Bank</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={Array.isArray(formData.bank) ? formData.bank[0] : formData.bank || ''}
              onValueChange={val => handleInputChange('bank', [val])}>
              <Picker.Item label="Select a bank" value="" />
              {banks.map((b, idx) => (
                <Picker.Item key={idx} label={b.bank} value={b.bank} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleAdditionalInfoSubmit}>
            <Text style={styles.buttonText}>Save Information</Text>
          </TouchableOpacity>
        </View>

        {/* Image Upload */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Update Property Images</Text>

          {formData.frontimage ? (
            <View style={{alignItems: 'center', marginBottom: 10}}>
              <Text style={{marginBottom: 6}}>Current front image:</Text>
              <Image
                source={{
                  uri: `http://${mydata.BASE_URL}/${formData.frontimage}`,
                }}
                style={styles.previewLarge}
              />
            </View>
          ) : null}

          <Text style={styles.label}>Front Image</Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={pickFrontImage}>
              <Text style={styles.buttonTextSmall}>
                {frontImage ? 'Change Front' : 'Choose Front'}
              </Text>
            </TouchableOpacity>

            {frontImage && (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={{uri: frontImage.uri}}
                  style={styles.previewSmall}
                />
                <TouchableOpacity onPress={() => setFrontImage(null)}>
                  <Text style={{color: 'red', marginTop: 6}}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {formData.prop_images &&
            Array.isArray(formData.prop_images) &&
            formData.prop_images.length > 0 && (
              <>
                <Text style={[styles.label, {marginTop: 12}]}>
                  Current property images
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{marginVertical: 6}}>
                  {formData.prop_images.map((img, idx) => (
                    <View key={idx} style={{marginRight: 10}}>
                      <TouchableOpacity
                        onPress={() => handleDeleteImage(img)}
                        style={{position: 'absolute', right: 6, zIndex: 2}}>
                        <Text style={{color: 'red', fontSize: 18}}>×</Text>
                      </TouchableOpacity>
                      <Image
                        source={{uri: `http://${mydata.BASE_URL}/${img}`}}
                        style={styles.previewSmall}
                      />
                    </View>
                  ))}
                </ScrollView>
              </>
            )}

          <Text style={[styles.label, {marginTop: 12}]}>
            Add More Property Images
          </Text>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={pickPropertyImages}>
            <Text style={styles.buttonTextSmall}>Choose Images</Text>
          </TouchableOpacity>

          {/* Preview picked property images */}
          {propertyImages.length > 0 && (
            <View style={{marginTop: 8}}>
              <Text style={{marginBottom: 6}}>New images preview</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {propertyImages.map((img, idx) => (
                  <View
                    key={idx}
                    style={{marginRight: 10, alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() => removePickedPropertyImage(idx)}
                      style={{position: 'absolute', right: 6, zIndex: 2}}>
                      <Text style={{color: 'red', fontSize: 18}}>×</Text>
                    </TouchableOpacity>
                    <Image
                      source={{uri: img.uri}}
                      style={styles.previewSmall}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, uploadingImages && {opacity: 0.7}]}
            onPress={handleImageSubmit}
            disabled={uploadingImages}>
            {uploadingImages ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Images</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Nearby Places */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add Nearby Places</Text>
          <TouchableOpacity onPress={addNearbyRow}>
            <Text style={{color: '#2b6cb0', marginBottom: 8}}>
              + Add new row
            </Text>
          </TouchableOpacity>

          {nearbyPlaces.map((p, idx) => (
            <View key={idx} style={styles.nearbyRow}>
              <TextInput
                style={[styles.input, {flex: 1, marginRight: 8}]}
                placeholder="Place name"
                value={p.place}
                onChangeText={t => handleNearbyChange(idx, 'place', t)}
              />
              <TextInput
                style={[styles.input, {flex: 1, marginRight: 8}]}
                placeholder="Distance"
                value={p.distance}
                onChangeText={t => handleNearbyChange(idx, 'distance', t)}
              />
              <TouchableOpacity onPress={() => removeNearbyRow(idx)}>
                <Text style={{color: 'red'}}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleNearbySubmit}>
            <Text style={styles.buttonText}>Save Information</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProperty;

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f6f0',
    padding: 16,
  },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  heading: {fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#000'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  label: {fontSize: 14, marginBottom: 6, color: '#333'},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  row: {flexDirection: 'row', marginBottom: 8},
  button: {
    backgroundColor: '#aa8453',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {color: '#fff', fontWeight: '700'},
  smallButton: {
    backgroundColor: '#967244',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginRight: 10,
  },
  buttonTextSmall: {color: '#fff', fontWeight: '600'},
  previewSmall: {
    width: 100,
    height: 70,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  previewLarge: {
    width: '100%',
    height: 160,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  amenitiesContainer: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  amenityItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  amenityChecked: {
    backgroundColor: '#e6d8c7',
    borderColor: '#aa8453',
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});
