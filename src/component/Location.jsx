import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Pagination from './Pagination'; // partial Pagination
import AdminHeader from './AdminHeader';
import {useNavigation} from '@react-navigation/native';
import mydata from '../../utils/data';
const Location = () => {
  const navigation = useNavigation();
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // for pagination carry-forward
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch(
        `http://${mydata.BASE_URL}/api/admin/getlocation`,
      );
      const data = await response.json();
      setLocations(data.mylocation);
      setFilteredData(data.mylocation);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch locations');
    }
  };

  // Live search filter
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredData(locations);
    } else {
      const results = locations.filter(
        item =>
          item.location &&
          item.location.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredData(results);
    }
  }, [search, locations]);

  const deleteLocation = async id => {
    try {
      const response = await fetch(
        `http://${mydata.BASE_URL}/api/admin/deletelocation/${id}`,
        {method: 'DELETE'},
      );
      if (response.ok) {
        const updated = filteredData.filter(item => item._id !== id);
        setLocations(prev => prev.filter(item => item._id !== id));
        setFilteredData(updated);
        setIsDeleteModalOpen(false);
        Alert.alert('Success', 'Location deleted successfully!');
      } else {
        Alert.alert('Error', 'Failed to delete location');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <>
      <AdminHeader />
      <View style={styles.container}>
        {/* Add button */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 1,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={{color: '#333', fontSize: 16}}>Dashboard</Text>
            </TouchableOpacity>
            <Text style={{color: '#b5895d', fontWeight: 'bold', fontSize: 16}}>
              {' '}
              / Locations
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              navigation.navigate('Addlocation');
            }}>
            <Text style={styles.addBtnText}>Add Location</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>
            Locations
          </Text>
        </View>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.searchBtn}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
          {/* Removed manual search button, search is now live */}
        </View>

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, {flex: 1}]}>S.No.</Text>
          <Text style={[styles.headerCell, {flex: 2}]}>Location</Text>
          <Text style={[styles.headerCell, {flex: 1}]}>Action</Text>
        </View>

        {/* Data list */}
        {pageData.length === 0 ? (
          <Text style={styles.emptyText}>No results found</Text>
        ) : (
          pageData.map((item, index) => (
            <View key={item._id} style={styles.row}>
              <Text style={[styles.cell, {flex: 1}]}>
                {' '}
                {(currentPage - 1) * itemsPerPage + (index + 1)}{' '}
              </Text>
              <Text style={[styles.cell, {flex: 2, textTransform: 'capitalize'}]}>{item.location}</Text>
              <TouchableOpacity
                style={[styles.deleteBtn, {flex: 0.8}]}
                onPress={() => {
                  setSelectedId(item._id);
                  setIsDeleteModalOpen(true);
                }}>
                <Icon name="trash" size={20} color="#b5895d" />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Pagination */}
        {filteredData.length > 0 && (
          <Pagination
            data={filteredData}
            itemsPerPage={itemsPerPage}
            onPageChange={(paged, pageNo, perPage) => {
              setPageData(paged);
              setCurrentPage(pageNo);
              setItemsPerPage(perPage);
            }}
          />
        )}

        <Modal
          transparent
          visible={isDeleteModalOpen}
          animationType="fade"
          onRequestClose={() => setIsDeleteModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Location</Text>
              <Text style={styles.modalMsg}>
                Are you sure you want to delete this location?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, {backgroundColor: '#aa8453'}]}
                  onPress={() => deleteLocation(selectedId)}>
                  <Text style={{color: '#fff'}}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, {backgroundColor: 'black'}]}
                  onPress={() => setIsDeleteModalOpen(false)}>
                  <Text style={{color: '#fff'}}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f9f6f0'},
  addBtn: {
    backgroundColor: '#aa8453',
    padding: 12,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  addBtnText: {color: '#fff', fontWeight: 'bold'},
  searchBox: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 8,
    alignItems: 'center',
  },
  input: {flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8},
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#b5895d',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerCell: {fontWeight: 'bold', color: '#fff'},
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  cell: {color: '#333'},
  deleteBtn: {padding: 5},
  emptyText: {textAlign: 'center', padding: 20, color: '#999'},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  modalMsg: {fontSize: 14, marginBottom: 20, color: '#333'},
  modalActions: {flexDirection: 'row', justifyContent: 'flex-end'},
  modalBtn: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  searchBtn: {
    backgroundColor: '#aa8453',
    padding: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
});
