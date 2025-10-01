import React, { useEffect, useState, useMemo } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import myurl from '../../utils/data';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropertyFilter from './PropertyFilter';
import Pagination from './Pagination'; // Your pagination component

const Browse = () => {
  const navigation = useNavigation();
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compMode, setCompMode] = useState(true);
  const [getToggleFilter, setToggleFilter] = useState(false);

  // Pagination states
  const [itemsPerPage, setItemsPerPage] = useState(myurl.pages);
  const [pageData, setPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch properties from backend
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://${myurl.BASE_URL}/api/admin/getproperties`
      );
      const mydata = await response.json();
      setProperties(mydata.myproperty || []);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching properties');
    } finally {
      setLoading(false);
    }
  };

  // Filter published properties (memoized to avoid infinite loops)
  const publishedProperties = useMemo(
    () => properties.filter(item => item.listing_status === 'Published'),
    [properties]
  );

  // Handle property selection for compare mode
  const toggleProperty = propertyId => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyIds: selectedProperties }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        navigation.navigate('Compare', { ids: selectedProperties });
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

  return (
    <ScrollView style={{ flex: 1 ,height:'100%'}}>
      <Navbar />

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {getToggleFilter && (
          <PropertyFilter
            setProperties={setProperties}
            properties={properties}
            getToggleFilter={getToggleFilter}
            setToggleFilter={setToggleFilter}
          />
        )}

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={{ padding: 0, display: getToggleFilter ? 'none' : 'flex' }}
              onPress={() => setToggleFilter(!getToggleFilter)}
            >
              <Icon name="bars" size={24} color="#060606ff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleBtn}
              onPress={() => setCompMode(!compMode)}
            >
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

          {/* Properties */}
          {publishedProperties.length === 0 ? (
            <View style={styles.noData}>
              <Text style={styles.noDataText}>No Properties Found</Text>
            </View>
          ) : (
            <View>
              {pageData.map(item => (
                <View key={item._id} style={styles.card}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      compMode &&
                      navigation.navigate('ViewProperty', { id: item._id })
                    }
                  >
                    <Image
                      source={{
                        uri: item.frontimage
                          ? `http://${myurl.BASE_URL}/${item.frontimage}`
                          : 'https://img.freepik.com/premium-photo/purely-vector-illustration-white-background_915071-14546.jpg?semt=ais_incoming&w=740&q=80',
                      }}
                      style={styles.image}
                    />
                    <View style={styles.cardContent}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.sub2}>
                        {item.location || 'Unknown Location'}
                      </Text>
                      <Text style={styles.price}>
                        ₹{Intl.NumberFormat('en-IN').format(Math.round(item.price))}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {!compMode && (
                    <TouchableOpacity
                      style={styles.compareBtn}
                      onPress={() => toggleProperty(item._id)}
                    >
                      <Text style={styles.compareText}>
                        {selectedProperties.includes(item._id)
                          ? 'Remove'
                          : 'Add to Compare'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {/* Pagination */}
              <Pagination
                data={publishedProperties}
                itemsPerPage={itemsPerPage}
                onPageChange={(paged, pageNo, perPage) => {
                  setPageData(paged);
                  setItemsPerPage(perPage);
                  setCurrentPage(pageNo);
                }}
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Browse;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10,height:'100%' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  toggleText: { color: '#fff', fontWeight: '600' },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 5,
    overflow: 'hidden',
    elevation: 2,
    width: '100%',
  },
  image: { width: '100%', height: 130, resizeMode: 'cover' },
  cardContent: { padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  price: { color: '#aa8453', fontWeight: '600' },
  sub2: { fontSize: 13, color: '#555' },
  compareBtn: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aa8453',
    alignSelf: 'flex-end',
    margin: 5,
  },
  compareText: { color: '#aa8453', fontSize: 12 },
  noData: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noDataText: { color: '#888', fontSize: 16 },
});
