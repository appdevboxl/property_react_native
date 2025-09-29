import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Pagination from './Pagination'; // custom pagination for RN
import perpage from '../../utils/data';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AdminHeader from './AdminHeader';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPageData, setCurrentPageData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(
        `http://${perpage.BASE_URL}/api/admin/getproperties`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );
      const mydata = await response.json();
      const props = mydata.myproperty || [];
      setProperties(props);
      setFilteredData(props);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching properties');
    }
  };

  const deleteProperty = async id => {
    try {
      const response = await fetch(
        `http://${perpage.BASE_URL}/api/admin/deleteproperty/${id}`,
        {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Property deleted successfully!');
        setProperties(prev => prev.filter(item => item._id !== id));
        setFilteredData(prev => prev.filter(item => item._id !== id));
        setIsDeleteModalOpen(false);
        setSelectedId(null);
      } else {
        Alert.alert('Error', 'Failed to delete property');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while deleting property');
    }
  };

  const mySubmit = () => {
    const results = properties.filter(item =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    setFilteredData(results);
  };

  const renderItem = ({item, index}) => (
    <View key={index} style={styles.row}>
      <Text style={styles.cell}>{index + 1}.</Text>
      <Text style={[styles.cell, {textTransform: 'capitalize'}]}>
        {item.title}
      </Text>
      <Text style={[styles.cell, {textTransform: 'capitalize'}]}>
        {item.builder_name}
      </Text>
      <Text style={[styles.cell, {textTransform: 'capitalize'}]}>
        {item.location}
      </Text>
      <View style={[styles.cell, {flexDirection: 'row'}]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Filter', {id: item._id})}>
          <Icon name="edit" size={18} color="#aa8453" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginLeft: 16}}
          onPress={() => {
            setIsDeleteModalOpen(true);
            setSelectedId(item._id);
          }}>
          <Icon name="trash" size={18} color="#aa8453" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#f9f6f0'}}>
      <AdminHeader />

      <View style={styles.container}>
        {/* Breadcrumb */}
        <View style={[styles.breadcrumb, {justifyContent: 'space-between'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('HomeTab', {screen: 'Dashboard'})
              }>
              <Text style={{color: '#333', fontSize: 16}}>Dashboard</Text>
            </TouchableOpacity>
            <Text style={{color: '#b5895d', fontWeight: 'bold', fontSize: 16}}>
              {' '}
              / Properties
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              navigation.navigate('AddProperties');
            }}>
            <Text style={styles.addBtnText}>Add Properties</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Properties</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={mySubmit}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>S. No.</Text>
          <Text style={styles.headerCell}>Title</Text>
          <Text style={styles.headerCell}>Builder</Text>
          <Text style={styles.headerCell}>Location</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>

        {/* Use map instead of FlatList */}
        {currentPageData.length > 0 ? (
          currentPageData.map((item, index) => renderItem({item, index}))
        ) : (
          <Text style={styles.noData}>No results found</Text>
        )}

        {/* Pagination */}
        <Pagination
          data={filteredData}
          itemsPerPage={perpage.pages}
          onPageChange={setCurrentPageData}
        />

        {/* Delete Modal */}
        <Modal
          visible={isDeleteModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsDeleteModalOpen(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Delete Property</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete this property?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => deleteProperty(selectedId)}>
                  <Text style={styles.confirmText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsDeleteModalOpen(false)}>
                  <Text style={styles.cancelText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 16},
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 16,
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
  searchButton: {
    backgroundColor: '#b5895d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },
  headerCell: {flex: 1, fontWeight: 'bold'},
  row: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cell: {flex: 1},
  noData: {textAlign: 'center', marginVertical: 16, color: '#888'},
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  modalMessage: {fontSize: 14, color: '#555', marginBottom: 20},
  modalActions: {flexDirection: 'row', justifyContent: 'flex-end', gap: 10},
  confirmButton: {
    backgroundColor: '#aa8453',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  confirmText: {color: '#fff'},
  cancelButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  cancelText: {color: '#fff'},
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
});

export default Properties;
