import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Navbar from './Navbar';
import myurl from '../../utils/data';

const Browse = () => {
  const navigation = useNavigation();
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compMode, setCompMode] = useState(true);

  // console.log(selectedProperties)
  useEffect(() => {
    fetchProperties();
  }, []);
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://${myurl.BASE_URL}/api/admin/getproperties`,
      );
      const mydata = await response.json();
      setProperties(mydata.myproperty || []);
    } catch (error) {
      // console.error("Error fetching properties:", error);
      Alert.alert('Error', 'Something went wrong while fetching properties');
    } finally {
      setLoading(false);
    }
  };

  const toggleProperty = propertyId => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId],
    );
  };

  const handleCompare = async () => {
    if (selectedProperties.length < 2) {
      Alert.alert('Warning', 'Select at least 2 properties to compare');
      return;
    }

    try {
      const res = await fetch(
        `http://${myurl.BASE_URL}/api/admin/compareproperty`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({propertyIds: selectedProperties}),
        },
      );

      const data = await res.json();
      if (res.ok) {
        navigation.navigate('Compare', {ids: selectedProperties});
      } else {
        Alert.alert('Error', data.message || 'Comparison failed');
      }
    } catch (err) {
      console.error('Error comparing properties:', err);
      Alert.alert('Error', 'Error comparing properties');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#aa8453" />
      </View>
    );
  }

  const renderCard = ({item}) => {
    if (item.listing_status !== 'Published') return null;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            compMode && navigation.navigate('ViewProperty', {id: item._id})
          }>
          <Image
            source={{
              uri: `http://${myurl.BASE_URL}/${item.frontimage}`,
            }}
            style={styles.image}
          />
          <View style={styles.cardContent}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>
                Posted on:{' '}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>
            <Text style={styles.price}>
              ₹{Intl.NumberFormat('en-IN').format(Math.round(item.price))}{' '}
              {item.property_for === 'Rent' ? (
                <Text style={styles.sub}>/month</Text>
              ) : null}
            </Text>
            <Text style={styles.sub2}>{item.property_type}</Text>
            <Text style={styles.sub2}>
              {item.location || 'Unknown Location'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Compare button only in Compare Mode */}
        {!compMode && (
          <TouchableOpacity
            style={styles.compareBtn}
            onPress={() => toggleProperty(item._id)}>
            <Text style={styles.compareText}>
              {selectedProperties.includes(item._id)
                ? 'Remove'
                : 'Add to Compare'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={{flex: 1}}>
      <Navbar />

      <View style={styles.container}>
        {/* Compare Mode Toggle */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setCompMode(!compMode)}>
            <Text style={styles.toggleText}>
              {compMode ? 'Enable Compare' : 'Browse Mode'}
            </Text>
          </TouchableOpacity>

          {!compMode && (
            <TouchableOpacity style={styles.toggleBtn} onPress={handleCompare}>
              <Text style={styles.toggleText}>
                Compare ({selectedProperties.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Property List */}
        {properties.filter(item => item.listing_status === 'Published')
          .length === 0 ? (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No Properties Found</Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {properties
              .filter(item => item.listing_status === 'Published')
              .map(item => (
                <View key={item._id} style={[styles.card, {width: '100%'}]}>
                  {' '}
                  {/* 2-column grid */}
                  {/* Card content is clickable only in Browse mode */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      compMode &&
                      navigation.navigate('ViewProperty', {id: item._id})
                    }>
                    <Image
                      source={{
                        uri: `http://${myurl.BASE_URL}/${item.frontimage}`,
                      }}
                      style={styles.image}
                    />
                    <View style={styles.cardContent}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.sub}>
                          Posted on:{' '}
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.price}>
                          ₹
                          {Intl.NumberFormat('en-IN').format(
                            Math.round(item.price),
                          )}
                        </Text>
                        {item.property_for === 'Rent' && (
                          <Text style={styles.sub}> /month</Text>
                        )}
                      </View>

                      <Text style={styles.sub2}>{item.property_type}</Text>
                      <Text style={styles.sub2}>
                        {item.location || 'Unknown Location'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Compare button only in Compare Mode */}
                  {!compMode && (
                    <TouchableOpacity
                      style={styles.compareBtn}
                      onPress={() => toggleProperty(item._id)}>
                      <Text style={styles.compareText}>
                        {selectedProperties.includes(item._id)
                          ? 'Remove'
                          : 'Add to Compare'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
          </View>
        )}
      </View>

      {/* <Footer /> */}
    </ScrollView>
  );
};

export default Browse;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 10},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  toggleBtn: {
    backgroundColor: '#aa8453',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  toggleText: {color: '#fff', fontWeight: '600'},
  row: {justifyContent: 'space-between'},
  card: {
    // flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
    elevation: 2,
    width: '100%',
  },
  image: {width: '100%', height: 120},
  cardContent: {padding: 10},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  price: {color: '#aa8453', fontWeight: '600', marginBottom: 2},
  sub: {fontSize: 12, color: '#555', fontWeight: '600'},
  sub2: {
    fontSize: 13,
    color: '#555',
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  compareBtn: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aa8453',
    alignSelf: 'flex-end',
    margin: 5,
  },
  compareText: {color: '#aa8453', fontSize: 12},
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  noDataText: {color: '#888', fontSize: 16},
});
