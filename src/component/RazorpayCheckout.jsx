import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  NativeModules,
  Platform,
} from 'react-native';
import data from '../../utils/data';

const RazorpayCheckout = ({amount, onSuccess, onError, userData}) => {
  const [loading, setLoading] = useState(false);
  const [razorpayAvailable, setRazorpayAvailable] = useState(false);

  useEffect(() => {
    checkRazorpayAvailability();
  }, []);

  const checkRazorpayAvailability = async () => {
    try {
      // Try to import Razorpay dynamically
      const RazorpayModule = await import('react-native-razorpay');
      const Razorpay = RazorpayModule.default || RazorpayModule;
      
      if (Razorpay && typeof Razorpay.open === 'function') {
        console.log('Razorpay module loaded successfully');
        setRazorpayAvailable(true);
      } else {
        console.log('Razorpay module found but open method missing');
        setRazorpayAvailable(false);
      }
    } catch (error) {
      console.log('Razorpay module import failed:', error);
      setRazorpayAvailable(false);
    }
  };

  const handlePayment = async () => {
    if (!razorpayAvailable) {
      Alert.alert(
        'Payment Unavailable',
        'Razorpay is not properly configured. Please try reinstalling the app or contact support.',
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Retry', onPress: checkRazorpayAvailability }
        ]
      );
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderResponse = await fetch(
        `http://${data.BASE_URL}/api/payment/create-order`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({amount}),
        },
      );
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
      
      const order = await orderResponse.json();

      const options = {
        description: 'Test Transaction',
        image: 'https://your-logo-url.com/logo.png',
        currency: 'INR',
        key: 'rzp_test_0nXAUesSGSeFkO',
        amount: order.amount * 100,
        order_id: order.id,
        name: 'Your Company',
        prefill: {
          email: userData?.email || 'john@example.com',
          contact: userData?.mobile_no || '9999999999',
          name: userData?.name || 'John Doe',
        },
        theme: {color: '#3399cc'},
      };

      // Dynamically import Razorpay to ensure it's loaded
      const RazorpayModule = await import('react-native-razorpay');
      const Razorpay = RazorpayModule.default || RazorpayModule;
      
      if (!Razorpay) {
        throw new Error('Razorpay module not available');
      }

      const response = await Razorpay.open(options);
      
      // Process successful payment
      const myorder = {
        ...userData,
        orderid: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        amount,
      };

      const res = await fetch(
        `http://${data.BASE_URL}/api/admin/paymentSuccess`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(myorder),
        },
      );

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to save payment');
      }

      Alert.alert('Success', 'Payment Successful!');
      onSuccess && onSuccess(responseData);
      
    } catch (error) {
      console.error('Payment error:', error);
      
      // Don't show alert for user cancellation (error code 2)
      if (error.code !== 2) {
        Alert.alert(
          'Payment Failed',
          error.description || error.message || 'Something went wrong with the payment'
        );
      }
      
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (!razorpayAvailable || loading) && styles.buttonDisabled
      ]}
      onPress={handlePayment}
      disabled={!razorpayAvailable || loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>
          {razorpayAvailable ? `Pay ₹${amount}` : 'Payment Loading...'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#aa8453',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: '#cccccc',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RazorpayCheckout;