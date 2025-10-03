import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import Footer from './Footer';
import RazorpayCheckout from './RazorpayCheckout';
import data from '../../utils/data';

// Placeholder PhonePe component
const PhonePeCheckout = ({ userData, amount, onSuccess, onError }) => {
  const handlePayment = () => {
    Alert.alert('PhonePe', 'PhonePe payment is not implemented in this demo.');
  };
  return (
    <TouchableOpacity onPress={handlePayment} style={{ padding: 10 }}>
      <Text style={{ color: '#fff' }}>Pay ₹{amount} with PhonePe</Text>
    </TouchableOpacity>
  );
};

const BookAgent = () => {
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const [bookingStep, setBookingStep] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_no: '',
    propertyId: id,
    preferredDate: '',
    preferredTime: '',
    message: '',
    address: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (name === 'mobile_no') {
      setMobileError(!/^\d{10}$/.test(value) ? 'Enter a valid 10-digit mobile number' : '');
    }
    if (name === 'email') {
      setEmailError(
        value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value.toLowerCase())
          ? 'Enter a valid email'
          : ''
      );
    }
  };
  console.log(paymentMethod);
  const handleNext = () => {
    if (mobileError || emailError) return;
    if (bookingStep === 1) {
      if (!formData.name || !formData.email || !formData.mobile_no) {
        Alert.alert('Validation Error', 'Please fill all required fields.');
        return;
      }
    }
    setBookingStep(prev => prev + 1);
  };

  const handleBack = () => setBookingStep(prev => prev - 1);
  const handlePaymentMethodSelect = method => setPaymentMethod(method);

  const agentDetails = {
    name: 'Agent',
    specialty: 'Residential Properties',
    rating: 4.9,
    image:
      'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?semt=ais_hybrid&w=740&q=80',
  };

  const handleError = err => console.error(err);

  return (
    <>
      <Navbar />
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Book a Property Agent</Text>
          <Text style={styles.subtitle}>Professional assistance for your property needs</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={bookingStep >= 1 ? styles.activeStep : styles.step}>1. Details</Text>
          <Text style={bookingStep >= 2 ? styles.activeStep : styles.step}>2. Review</Text>
          <Text style={bookingStep >= 3 ? styles.activeStep : styles.step}>3. Confirmation</Text>
        </View>

        {/* Agent Card */}
        <View style={styles.agentCard}>
          <Image source={{ uri: agentDetails.image }} style={styles.agentImage} />
          <View style={styles.agentInfo}>
            <Text style={styles.agentName}>{agentDetails.name}</Text>
            <Text style={styles.agentSpec}>{agentDetails.specialty}</Text>
            <Text>⭐ {agentDetails.rating}</Text>
          </View>
          <Text style={styles.agentPrice}>₹{data.agentfees}</Text>
        </View>

        {/* Step 1: Form */}
        {bookingStep === 1 && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.name}
              onChangeText={val => handleInputChange('name', val)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={val => handleInputChange('email', val)}
            />
            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Mobile No"
              keyboardType="numeric"
              maxLength={10}
              value={formData.mobile_no}
              onChangeText={val => handleInputChange('mobile_no', val)}
            />
            {mobileError ? <Text style={styles.error}>{mobileError}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Preferred Date (YYYY-MM-DD)"
              value={formData.preferredDate}
              onChangeText={val => handleInputChange('preferredDate', val)}
            />
            <TextInput
              style={styles.input}
              placeholder="Preferred Time (e.g. 2:00 PM)"
              value={formData.preferredTime}
              onChangeText={val => handleInputChange('preferredTime', val)}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={formData.address}
              onChangeText={val => handleInputChange('address', val)}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Additional Message (Optional)"
              multiline
              value={formData.message}
              onChangeText={val => handleInputChange('message', val)}
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Review & Payment */}
        {bookingStep === 2 && (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16 }}>
              Select Payment Method
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 }}>
              {/* Razorpay */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'Razorpay' && styles.paymentSelected,
                ]}
                onPress={() => handlePaymentMethodSelect('Razorpay')}
              >
                <Text style={styles.paymentText}>Razor Pay</Text>
              </TouchableOpacity>

              {/* PhonePe */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'Phonepe' && styles.paymentSelected,
                ]}
                onPress={() => handlePaymentMethodSelect('Phonepe')}
              >
                <Text style={styles.paymentText}>Phone Pay</Text>
              </TouchableOpacity>
            </View>

            {paymentMethod && (
              <View style={styles.summaryBox}>
                <Text style={{ fontWeight: '500', marginBottom: 8 }}>Booking Summary</Text>
                <View style={styles.summaryRow}>
                  <Text>Agent Fee</Text>
                  <Text>₹{data.agentfees}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>Tax (18%)</Text>
                  <Text>₹{(data.agentfees * 18) / 100}</Text>
                </View>
                <View style={styles.summaryRowTotal}>
                  <Text>Total Amount</Text>
                  <Text>₹{data.agentfees + (data.agentfees * 18) / 100}</Text>
                </View>
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              {paymentMethod === 'Razorpay' ? (
                <RazorpayCheckout
                  userData={formData}
                  amount={data.agentfees + (data.agentfees * 18) / 100}
                  onSuccess={() => setBookingStep(3)}
                  onError={handleError}
                />
              ) : paymentMethod === 'Phonepe' ? (
                <PhonePeCheckout
                  userData={formData}
                  amount={data.agentfees + (data.agentfees * 18) / 100}
                  onSuccess={() => setBookingStep(3)}
                  onError={handleError}
                />
              ) : (
                <TouchableOpacity disabled style={[styles.button, { backgroundColor: '#ccc' }]}>
                  <Text style={styles.buttonText}>Pay</Text>
                </TouchableOpacity>
              )}
            </View>
            <PhonePeCheckout/>
          </View>
        )}

        {/* Step 3: Confirmation */}
        {bookingStep === 3 && (
          <View style={styles.confirmBox}>
            <Text style={styles.success}>✅ Booking Confirmed!</Text>
            <Text>Your agent has been successfully booked.</Text>
            <Text>
              {formData.preferredDate} at {formData.preferredTime}
            </Text>
            <Text>Amount: ₹{data.agentfees}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setBookingStep(1);
                setFormData({
                  name: '',
                  email: '',
                  mobile_no: '',
                  propertyId: id,
                  preferredDate: '',
                  preferredTime: '',
                  message: '',
                  address: '',
                });
              }}
            >
              <Text style={styles.buttonText}>Book Another Agent</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Browse')}>
              <Text style={styles.backText}>Go to Browse Page</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {/* <Footer /> */}
    </>
  );
};

export default BookAgent;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  header: { alignItems: 'center', marginVertical: 10 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#555' },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  step: { color: '#888' },
  activeStep: { color: '#aa8453', fontWeight: 'bold' },
  agentCard: {
    flexDirection: 'row',
    backgroundColor: '#f6efeb',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  agentImage: { width: 60, height: 60, borderRadius: 30 },
  agentInfo: { flex: 1, marginLeft: 10 },
  agentName: { fontSize: 16, fontWeight: 'bold' },
  agentSpec: { color: '#555' },
  agentPrice: { color: '#aa8453', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#aa8453',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  backBtn: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 120,
    marginTop: 20,
  },
  backText: { color: '#000', fontWeight: 'bold' },
  confirmBox: { alignItems: 'center', marginVertical: 20 },
  success: { fontSize: 20, color: 'green', fontWeight: 'bold', marginBottom: 10 },
  error: { color: 'red', marginBottom: 10 },
  paymentOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    marginBottom: 12,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  paymentSelected: {
    borderColor: '#aa8453',
    backgroundColor: '#bfdbfe',
  },
  paymentText: { fontWeight: '500' },
  summaryBox: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
});
