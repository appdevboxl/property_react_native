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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Pagination from './Pagination'; // Your custom pagination
import AdminHeader from './AdminHeader';
import {useNavigation} from '@react-navigation/native';
import mydata from '../../utils/data';

const Openleads = () => {
  const navigation = useNavigation();
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [pageData, setPageData] = useState([]);
 
  

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(mydata.pages);

  useEffect(() => {
    fetchAgents();
  }, []);

  // Fetch agents from backend
  const fetchAgents = async () => {
    try {
      const response = await fetch(
        `http://${mydata.BASE_URL}/api/admin/getopenleads`,
      );
      const data = await response.json();
      if (data.myleads && Array.isArray(data.myleads)) {
        setLeads(data.myleads);
        setFilteredData(data.myleads);
      } else {
        console.warn('No leads found or invalid data:', data);
        setLeads([]);
        setFilteredData([]);
        Alert.alert('Warning', 'No leads found');
      }
    } catch (error) {
      console.error('Fetch leads error:', error);
      Alert.alert('Error', 'Failed to fetch leads');
    }
  };

  // Handle search button press (optional, for explicit search)
  const handleSearch = () => {
    if (search.trim() === '') {
      setFilteredData(leads);
    } else {
      const results = leads.filter(
        item =>
          (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.location || '').toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredData(results);
    }
    setCurrentPage(1); // Reset to first page after search
  };

  // Live search effect (optional, can be removed if using button)
  useEffect(() => {
    handleSearch(); // Reuse the same logic as button search
  }, [search, leads]);

  // Delete agent by ID
  const deleteAgentById = async id => {
    try {
      const response = await fetch(
        `http://${mydata.BASE_URL}/api/admin/deleteagent/${id}`,
        {method: 'DELETE'},
      );
      if (response.ok) {
        const updated = filteredData.filter(item => item._id !== id);
        setAgents(prev => prev.filter(item => item._id !== id));
        setFilteredData(updated);
        Alert.alert('Success', 'Agent deleted successfully!');
      } else {
        Alert.alert('Error', 'Failed to delete agent');
      }
    } catch (error) {
      console.error('Delete agent error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <>
      <AdminHeader />
      <ScrollView style={styles.container}>
        {/* Breadcrumb & Add button */}
        <View style={styles.headerRow}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={{color: '#333', fontSize: 16}}>Dashboard </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Leads')}>
              <Text style={{color: '#333', fontSize: 16}}>/ Leads</Text>
            </TouchableOpacity>
            <Text style={{color: '#b5895d', fontWeight: 'bold', fontSize: 16}}>
              {' '}
              / Open Leads
            </Text>
          </View>
        </View>

        <Text style={{fontSize: 18, fontWeight: 'bold', marginVertical: 16}}>
          Open Leads
        </Text>
        {/* Search */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search..."
            style={styles.input}
            value={search}
            onChangeText={setSearch} // Live search
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View  style={styles.tableHeader}>
          <Text style={[styles.headerCell, {flex: .7}]}>S.</Text>
          <Text style={[styles.headerCell, {flex: 1.8}]}>Name</Text>
          <Text style={[styles.headerCell, {flex: 1.8}]}>Type</Text>
          <Text style={[styles.headerCell, {flex: 2.5}]}>Location</Text>
          <Text style={[styles.headerCell, {flex: 2.2}]}>Date</Text>
          <Text style={[styles.headerCell, {flex: 2.9}]}>Assigned</Text>
          <Text style={[styles.headerCell, {flex: 1.5}]}>Action</Text>
        </View>

        {/* Data rows */}
        {pageData.length === 0 ? (
          <Text style={styles.emptyText}>No results found</Text>
        ) : (
          pageData.map((item, index) => (
            <View key={item._id} style={styles.row}>
              <Text style={[styles.cell, {flex: .4}]}>
                {(currentPage - 1) * itemsPerPage + (index + 1)}
              </Text>
              <Text style={[styles.cell, {flex: 1}]}>{item.name || 'N/A'}</Text>
              <Text style={[styles.cell, {flex: .8}]}>
                {item.type || 'N/A'}
              </Text>
              <Text style={[styles.lcell, {flex: .9}]}>
                {item.location || 'N/A'}
              </Text><Text style={[styles.cell, {flex: 1.5}]}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <Text style={[styles.cell, {flex: 1.7}]}>
                {item.assigned || 'N/A'}
              </Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {navigation.navigate('EditLead', {id: item._id});}}>
                <Icon name="edit" size={15} color="#b5895d" />
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
      </ScrollView>

    </>
  );
};

export default Openleads;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f9f6f0'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: '#aa8453',
    padding: 12,
    borderRadius: 5,
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
  lcell: {color: '#333',fontSize: 10,fontWeight: 'bold', flexWrap: 'wrap',textTransform: 'capitalize'},
});
