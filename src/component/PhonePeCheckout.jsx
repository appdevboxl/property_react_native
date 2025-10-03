import { Linking, Alert } from 'react-native';

const PhonePeCheckout = ({ amount, mobile }) => {
  const handlePayment = async () => {
    try {
      // Example intent URL
      const url = `phonepe://upi/pay?pa=merchant@upi&pn=MerchantName&tr=${Date.now()}&am=${amount}&cu=INR`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('PhonePe not installed', 'Please install the PhonePe app to proceed.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Cannot open PhonePe.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePayment}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>Pay ₹{amount}</Text>
      )}
    </TouchableOpacity>
  );
};


export default PhonePeCheckout;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#aa8453',
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 10,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    zIndex: 10,  
    backgroundColor: '#aa8453',
  },
});
