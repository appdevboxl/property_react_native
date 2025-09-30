import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import mydata from '../../utils/data';

const Agent = () => {
  const navigation = useNavigation();
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(mydata.pages);

  useEffect(() => {
    fetchAgents();
  }, []);

  // Fetch agents from backend
  const fetchAgents = async () => {
    try {
      const response = await fetch(`http://${mydata.BASE_URL}/api/admin/getagents`);
      const data = await response.json();
      if (data.myagent && Array.isArray(data.myagent)) {
        setAgents(data.myagent);
        setFilteredData(data.myagent);
      } else {
        console.warn('No agents found or invalid data:', data);
        setAgents([]);
        setFilteredData([]);
        Alert.alert('Warning', 'No agents found');
      }
    } catch (error) {
      console.error('Fetch agents error:', error);
      Alert.alert('Error', 'Failed to fetch agents');
    }
  };

  // Handle search button press (optional, for explicit search)
  const handleSearch = () => {
    if (search.trim() === '') {
      setFilteredData(agents);
    } else {
      const results = agents.filter(item =>
        (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.status || '').toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(results);
    }
    setCurrentPage(1); // Reset to first page after search
  };

  // Live search effect (optional, can be removed if using button)
  useEffect(() => {
    handleSearch(); // Reuse the same logic as button search
  }, [search, agents]);

  // Delete agent by ID
  const deleteAgentById = async id => {
    try {
      const response = await fetch(
        `http://${mydata.BASE_URL}/api/admin/deleteagent/${id}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        const updated = filteredData.filter(item => item._id !== id);
        setAgents(prev => prev.filter(item => item._id !== id));
        setFilteredData(updated);
        setIsDeleteModalOpen(false);
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={{ color: '#333', fontSize: 16 }}>Dashboard</Text>
            </TouchableOpacity>
            <Text style={{ color: '#b5895d', fontWeight: 'bold', fontSize: 16 }}>
              {' '} / Agents
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddAgent')}
          >
            <Text style={styles.addBtnText}>Add Agent</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>
            Agents
          </Text>
        </View>
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
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 1.2 }]}>S.No.</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Location</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Status</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Action</Text>
        </View>

        {/* Data rows */}
        {pageData.length === 0 ? (
          <Text style={styles.emptyText}>No results found</Text>
        ) : (
          pageData.map((item, index) => (
            <View key={item._id} style={styles.row}>
              <Text style={[styles.cell, { flex: 1.2 }]}>
                {(currentPage - 1) * itemsPerPage + (index + 1)}
              </Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.name || 'N/A'}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.location || 'N/A'}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.status || 'N/A'}</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  setSelectedId(item._id);
                  setIsDeleteModalOpen(true);
                }}
              >
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
      </ScrollView>

      {/* Delete Modal */}
      <Modal
        transparent
        visible={isDeleteModalOpen}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Agent</Text>
            <Text style={styles.modalMsg}>
              Are you sure you want to delete this agent?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#aa8453' }]}
                onPress={() => deleteAgentById(selectedId)}
              >
                <Text style={{ color: '#fff' }}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: 'black' }]}
                onPress={() => setIsDeleteModalOpen(false)}
              >
                <Text style={{ color: '#fff' }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Agent;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f6f0' },
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
  addBtnText: { color: '#fff', fontWeight: 'bold' },
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
    paddingHorizontal: 20,
  },
  headerCell: { fontWeight: 'bold', color: '#fff' },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  cell: { color: '#333' },
  deleteBtn: { padding: 5 },
  emptyText: { textAlign: 'center', padding: 20, color: '#999' },
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
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalMsg: { fontSize: 14, marginBottom: 20, color: '#333' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalBtn: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 70,
    alignItems: 'center',
  },
});