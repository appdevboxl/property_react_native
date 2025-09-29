import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Pagination from './Pagination'; // Your custom pagination
import AdminHeader from './AdminHeader';
import {useNavigation} from '@react-navigation/native';
import mydata from '../../utils/data';

const Banks = () => {
  const navigation = useNavigation();
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchBanks();
  }, []);

  // Fetch banks from backend
  const fetchBanks = async () => {
    try {
      const response = await fetch(`http://${mydata.BASE_URL}/api/admin/banks`);
      const data = await response.json();
      if (data.mybank && Array.isArray(data.mybank)) {
        setLeads(data.mybank);
        setFilteredData(data.mybank);
      } else {
        console.warn('No banks found or invalid data:', data);
        setLeads([]);
        setFilteredData([]);
        Alert.alert('Warning', 'No banks found');
      }
    } catch (error) {
      console.error('Fetch banks error:', error);
      Alert.alert('Error', 'Failed to fetch banks');
    }
  };

  // Handle search button press
  const handleSearch = () => {
    if (search.trim() === '') {
      setFilteredData(leads);
    } else {
      const results = leads.filter(
        item =>
          (item.bank || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.ROI
            ? String(item.ROI).toLowerCase().includes(search.toLowerCase())
            : false),
      );
      setFilteredData(results);
    }
    setCurrentPage(1); // Reset to first page
  };

  // Live search effect
  useEffect(() => {
    handleSearch();
  }, [search, leads]);

  // Delete bank
  const deleteBank = async id => {
    try {
      const response = await fetch(
        `http://${mydata.BASE_URL}/api/admin/deletebank/${id}`,
        {method: 'DELETE'},
      );
      if (response.ok) {
        const updatedLeads = leads.filter(item => item._id !== id);
        setLeads(updatedLeads);
        setFilteredData(updatedLeads);
        setIsDeleteModalOpen(false);
        Alert.alert('Success', 'Bank deleted successfully!');
      } else {
        setIsDeleteModalOpen(false);
        Alert.alert('Error', 'Failed to delete bank');
      }
    } catch (error) {
      console.error('Delete bank error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <>
      <AdminHeader />
      <ScrollView style={styles.container}>
        {/* Breadcrumb & Add button row */}
        <View style={styles.headerRow}>
          {/* Breadcrumb */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={{color: '#333', fontSize: 16}}>Dashboard </Text>
            </TouchableOpacity>
            <Text style={{color: '#b5895d', fontWeight: 'bold', fontSize: 16}}>
              {' '} / Banks
            </Text>
          </View>

          {/* Add button */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddBank')}>
            {/* <Icon name="plus" size={14} color="#fff" style={{marginRight: 6}} /> */}
            <Text style={styles.addBtnText}>Add Bank</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={{fontSize: 18, fontWeight: 'bold', marginVertical: 16}}>
          Banks
        </Text>

        {/* Search */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, {flex: 0.7}]}>S.</Text>
          <Text style={[styles.headerCell, {flex: 1.8}]}>Name</Text>
          <Text style={[styles.headerCell, {flex: 1.8}]}>ROI</Text>
          <Text style={[styles.headerCell, {flex: 2.5}]}>Logo</Text>
          <Text style={[styles.headerCell, {flex: 1.5}]}>Action</Text>
        </View>

        {/* Data Rows */}
        {pageData.length === 0 ? (
          <Text style={styles.emptyText}>No results found</Text>
        ) : (
          pageData.map((item, index) => (
            <View key={item._id} style={styles.row}>
              <Text style={[styles.cell, {flex: 0.7}]}>
                {(currentPage - 1) * itemsPerPage + (index + 1)}
              </Text>
              <Text style={[styles.cell, {flex: 1.2, textTransform: 'capitalize'}]}>
                {item.bank || 'N/A'}
              </Text>
              <Text style={[styles.cell, {flex: 0.8}]}>{item.ROI || 'N/A'}</Text>
              <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                {item.file ? (
                  <Image
                    source={{uri: `http://${mydata.BASE_URL}/uploads/${item.file}`}}
                    style={styles.image}
                  />
                ) : (
                  <Text style={styles.cell}>No Logo</Text>
                )}
              </View>
              <View style={{flex: 1.5, alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    setSelectedId(item._id);
                    setIsDeleteModalOpen(true);
                  }}>
                  <Icon name="trash" size={15} color="#b5895d" />
                </TouchableOpacity>
              </View>
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

        {/* Delete Modal */}
        <Modal
          transparent
          visible={isDeleteModalOpen}
          animationType="fade"
          onRequestClose={() => setIsDeleteModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Bank</Text>
              <Text style={styles.modalMsg}>
                Are you sure you want to delete this bank?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, {backgroundColor: '#aa8453'}]}
                  onPress={() => deleteBank(selectedId)}>
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
      </ScrollView>
    </>
  );
};

export default Banks;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f9f6f0'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#aa8453',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignItems: 'center',
  },
  addBtnText: {color: '#fff', fontWeight: 'bold'},
  searchBox: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
  },
  searchBtn: {
    backgroundColor: '#aa8453',
    padding: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#b5895d',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCell: {fontWeight: 'bold', color: '#fff'},
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  cell: {color: '#333'},
  deleteBtn: {paddingHorizontal: 3},
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
  image: {width: 60, height: 40, resizeMode: 'contain'},
});
