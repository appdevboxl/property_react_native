import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import mydata from '../../utils/data';
import AdminHeader from './AdminHeader';
const EditLead = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params;

  const [lead, setLead] = useState(null);
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    assigned: '',
    status: 'open',
    comment: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadRes = await fetch(
          `http://${mydata.BASE_URL}/api/admin/leads/${id}`,
        );
        const leadData = await leadRes.json();

        if (!leadRes.ok) throw new Error('Failed to fetch lead');

        const leadDetails = leadData.myleads;
        setLead(leadDetails);
        setFormData({
          assigned: leadDetails.assigned || '',
          status: leadDetails.status || 'open',
          comment: leadDetails.comment || '',
        });

        const agentsRes = await fetch(
          `http://${mydata.BASE_URL}/api/admin/getagents`,
        );
        const agentsData = await agentsRes.json();
        const activeAgents = agentsData.myagent.filter(
          agent => agent.status === 'Active',
        );
        setAgents(activeAgents);
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    };

    fetchData();
  }, [id]);

  // Handle save
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://${mydata.BASE_URL}/api/admin/editleads/${id}`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        },
      );

      const responseData = await res.json();
      if (!res.ok)
        throw new Error(responseData.message || 'Failed to update lead');

      Alert.alert('Success', 'Successfully updated the lead', [
        {text: 'OK', onPress: () => navigation.navigate('Leads')},
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!lead) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#aa8453" />
        <Text style={{marginTop: 10}}>Fetching lead details...</Text>
      </View>
    );
  }

  return (
    <>
    <AdminHeader/>
    <ScrollView style={styles.container}>
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
                      / Edit Leads
                    </Text>
                  </View>
                </View>
      <Text style={styles.heading}>Edit Lead</Text>

      {/* Basic info */}
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <Text style={[styles.readonly,{textTransform: 'capitalize'}]}>{lead.name || 'N/A'}</Text>

        <Text style={styles.label}>Type</Text>
        <Text style={[styles.readonly,{textTransform: 'capitalize'}]}>{lead.type || 'N/A'}</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={[styles.readonly,{textTransform: 'capitalize'}]}>{lead.location || 'N/A'}</Text>
      </View>

      {/* Assigned To */}
      <View style={styles.section}>
        <Text style={styles.label}>Assigned To</Text>
        <View style={styles.optionBorder}>
          <Picker
            selectedValue={formData.assigned}
            onValueChange={value =>
              setFormData({...formData, assigned: value})
            }>
            <Picker.Item label="Select an agent" value="" />
            {agents.map(agent => (
              <Picker.Item
                key={agent._id}
                label={agent.name}
                value={agent.name}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Status */}
      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.optionBorder}>
          <Picker
            selectedValue={formData.status}
            onValueChange={value => setFormData({...formData, status: value})}>
            <Picker.Item label="Open" value="open" />
            <Picker.Item label="Closed" value="closed" />
            <Picker.Item label="Lost" value="lost" />
          </Picker>
        </View>
      </View>

      {/* Comment */}
      <View style={styles.section}>
        <Text style={styles.label}>Comment</Text>
        <TextInput
          multiline
          numberOfLines={5}
          style={styles.textarea}
          value={formData.comment}
          onChangeText={text => setFormData({...formData, comment: text})}
        />
      </View>

      {/* Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelBtn]}
          onPress={() => navigation.navigate('Leads')}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveBtn]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.saveText}>
            {loading ? 'Saving...' : 'Save Information'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
};

export default EditLead;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#f9f6f0'},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f6f0',
  },
  heading: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000',marginTop:15},
  section: {marginBottom: 20},
  optionBorder: {borderColor: '#ccc', borderWidth: 1, padding: 10},
  label: {fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#333'},
  readonly: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    color: '#000',
    marginBottom: 10,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {backgroundColor: '#ddd'},
  saveBtn: {backgroundColor: '#aa8453'},
  cancelText: {color: '#333', fontWeight: 'bold'},
  saveText: {color: '#fff', fontWeight: 'bold'},
});
