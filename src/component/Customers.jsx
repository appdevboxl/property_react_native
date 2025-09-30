import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  Share,
  Dimensions,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import perpage from '../../utils/data';
import Pagination from './Pagination';
import AdminHeader from './AdminHeader';
import myipdata from '../../utils/data';

// const navigation = useNavigation();
const {width} = Dimensions.get('window');
const formatDate = date => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const NativeDatePicker = ({value, onChange, placeholder}) => {
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 20}, (_, i) => currentYear - 10 + i);

  const months = [
    {value: 0, label: 'Jan'},
    {value: 1, label: 'Feb'},
    {value: 2, label: 'Mar'},
    {value: 3, label: 'Apr'},
    {value: 4, label: 'May'},
    {value: 5, label: 'Jun'},
    {value: 6, label: 'Jul'},
    {value: 7, label: 'Aug'},
    {value: 8, label: 'Sep'},
    {value: 9, label: 'Oct'},
    {value: 10, label: 'Nov'},
    {value: 11, label: 'Dec'},
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateChange = (type, newValue) => {
    const newDate = new Date(selectedDate);

    if (type === 'year') newDate.setFullYear(parseInt(newValue));
    if (type === 'month') newDate.setMonth(parseInt(newValue));
    if (type === 'day') newDate.setDate(parseInt(newValue));

    setSelectedDate(newDate);
    onChange(newDate);
  };

  const daysInMonth = getDaysInMonth(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
  );
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1);

  return (
    <>
      <View style={styles.nativePickerContainer}>
        <Text style={styles.pickerLabel}>{placeholder}</Text>
        <View style={styles.pickerRow}>
          {/* Day Picker */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerTitle}>Day</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDate.getDate()}
                onValueChange={value => handleDateChange('day', value)}
                style={styles.picker}
                dropdownIconColor="#aa8453"
                mode="dropdown">
                {days.map(day => (
                  <Picker.Item
                    key={day}
                    label={`${day}`}
                    value={day}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Month Picker */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerTitle}>Month</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDate.getMonth()}
                onValueChange={value => handleDateChange('month', value)}
                style={styles.picker}
                dropdownIconColor="#aa8453"
                mode="dropdown">
                {months.map(month => (
                  <Picker.Item
                    key={month.value}
                    label={month.label}
                    value={month.value}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Year Picker */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerTitle}>Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDate.getFullYear()}
                onValueChange={value => handleDateChange('year', value)}
                style={styles.picker}
                dropdownIconColor="#aa8453"
                mode="dropdown">
                {years.map(year => (
                  <Picker.Item
                    key={year}
                    label={`${year}`}
                    value={year}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Selected Date Preview */}
        <View style={styles.selectedPreview}>
          <Text style={styles.selectedPreviewText}>
            Selected: {formatDate(selectedDate)}
          </Text>
        </View>
      </View>
    </>
  );
};

const Customers = ({navigation}) => {
  const [customers, setCustomers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [currentPageData, setCurrentPageData] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `http://${myipdata.BASE_URL}/api/admin/customers`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );
      const mydata = await response.json();
      setCustomers(mydata.customers || []);
      setFilteredData(mydata.customers || []);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching data');
    }
  };

  const handleFromDateChange = date => {
    setFrom(date);
  };

  const handleToDateChange = date => {
    setTo(date);
  };

  const handleFilter = () => {
    if (!from || !to) {
      Alert.alert('Warning', 'Please select both From and To dates');
      return;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    toDate.setHours(23, 59, 59, 999);

    const filtered = customers.filter(c => {
      const createdDate = new Date(c.createdAt);
      return createdDate >= fromDate && createdDate <= toDate;
    });

    setFilteredData(filtered);
    setShowTable(true);
  };

  const handleDownload = async () => {
    if (!filteredData.length) {
      Alert.alert('Warning', 'No data to download');
      return;
    }

    const fields = [
      'name',
      'email',
      'mobile_no',
      'location',
      'status',
      'createdAt',
    ];
    const headers = fields.join(',');
    const rows = filteredData
      .map(c =>
        fields
          .map(f => (f === 'createdAt' ? formatDate(c[f]) : c[f] || ''))
          .join(','),
      )
      .join('\n');

    const csvContent = [headers, rows].join('\n');

    try {
      await Share.share({
        message: csvContent,
        title: 'Customers CSV',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share CSV');
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}.</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.mobile_no}</Text>
      <Text style={styles.cell}>{item.location}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <Text style={styles.cell}>{formatDate(item.createdAt)}</Text>
    </View>
  );

  return (
    <>
      <AdminHeader />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={{color: '#333', fontSize: 16}}>Dashboard</Text>
            </TouchableOpacity>
            <Text style={{color: '#b5895d', fontWeight: 'bold', fontSize: 16}}>
              {' '}
              / Customers Data
            </Text>
          </View>
          <Text style={styles.title}>Customers Data</Text>

          {/* Filter Section */}
          <View style={styles.filterContainer}>
            {/* From Date Picker */}
            <NativeDatePicker
              value={from ? new Date(from) : new Date()}
              onChange={handleFromDateChange}
              placeholder="From Date"
            />

            {/* To Date Picker */}
            <NativeDatePicker
              value={to ? new Date(to) : new Date()}
              onChange={handleToDateChange}
              placeholder="To Date"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => {
                  handleFilter();
                  if (from || to) {
                    Alert.alert('Success', 'Customers data fetch successfully');
                    return;
                  }
                }}>
                <Text style={styles.buttonText}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownload}>
                <Text style={styles.buttonText}>Download</Text>
              </TouchableOpacity>
            </View>

            {/* Selected Dates Display */}
            <View style={styles.selectedDatesContainer}>
              <Text style={styles.selectedDateLabel}>Selected Date Range:</Text>
              <Text style={styles.selectedDateText}>
                📅 From:{' '}
                <Text style={styles.dateValue}>
                  {from ? formatDate(from) : 'Not selected'}
                </Text>
              </Text>
              <Text style={styles.selectedDateText}>
                📅 To:{' '}
                <Text style={styles.dateValue}>
                  {to ? formatDate(to) : 'Not selected'}
                </Text>
              </Text>
            </View>
          </View>

          {/* Table Section */}
          {showTable && (
            <>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>S. No.</Text>
                <Text style={styles.headerCell}>Name</Text>
                <Text style={styles.headerCell}>Email</Text>
                <Text style={styles.headerCell}>Phone</Text>
                <Text style={styles.headerCell}>Location</Text>
                <Text style={styles.headerCell}>Status</Text>
                <Text style={styles.headerCell}>Created At</Text>
              </View>

              {filteredData.length > 0 ? (
                <View style={styles.flatList}>
                  {currentPageData.map((item, index) => (
                    <View style={styles.row} key={item._id || index}>
                      <Text style={styles.cell}>{index + 1}.</Text>
                      <Text style={styles.cell}>{item.name}</Text>
                      <Text style={styles.cell}>{item.email}</Text>
                      <Text style={styles.cell}>{item.mobile_no}</Text>
                      <Text style={styles.cell}>{item.location}</Text>
                      <Text style={styles.cell}>{item.status}</Text>
                      <Text style={styles.cell}>{formatDate(item.createdAt)}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noData}>
                  No data found for selected date range
                </Text>
              )}

              {filteredData.length > 0 && (
                <Pagination
                  data={filteredData}
                  itemsPerPage={perpage.pages}
                  onPageChange={setCurrentPageData}
                />
              )}
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f6f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    // textAlign: "center",
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Native Picker Styles - IMPROVED
  nativePickerContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fafafa',
  },
  pickerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#666',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  pickerItem: {
    fontSize: 14,
    color: '#333',
  },
  selectedPreview: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#e8f4fd',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  selectedPreviewText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2196F3',
    textAlign: 'center',
  },

  // Selected Dates Display
  selectedDatesContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#aa8453',
  },
  selectedDateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  dateValue: {
    fontWeight: 'bold',
    color: '#aa8453',
  },

  // Button Styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#aa8453',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  downloadButton: {
    backgroundColor: '#7e8283ff',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },

  // Table Styles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#aa8453',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: 10,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    color: '#333',
  },
  flatList: {
    maxHeight: 300,
    marginBottom: 10,
  },
  noData: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
  },
});

export default Customers;
