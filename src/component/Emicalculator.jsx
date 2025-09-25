import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import Navbar from './Navbar';
import Footer from './Footer';
import { debounce } from 'lodash';

const { width } = Dimensions.get('window');

const Emicalculator = () => {
  const [loanAmount, setLoanAmount] = useState('5000000');
  const [tenure, setTenure] = useState('2');
  const [rate, setRate] = useState('8.75');
  const [emi, setEmi] = useState('₹0');
  const [totalInterest, setTotalInterest] = useState(0);
  const [formattedInterest, setFormattedInterest] = useState('₹0');
  const [totalPayment, setTotalPayment] = useState('₹0');
  const [error, setError] = useState('');

  // Format number as INR (e.g., 5000000 -> "50,00,000" or rate as is)
  const formatInputValue = (value, isRate = false) => {
    if (value === '') return '';
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (isRate) return numericValue; // Keep raw for rate (e.g., "8.75")
    return parseFloat(numericValue).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
  };

  // Parse formatted input back to raw number (e.g., "50,00,000" -> "5000000")
  const parseInputValue = (value) => {
    return value.replace(/,/g, '');
  };

  // Format number as INR currency (e.g., 5000000 -> "₹50,00,000")
  const formatINR = (num) => {
    const number = parseFloat(num);
    if (isNaN(number) || number <= 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(number));
  };

  // Validate input ranges
  const validateInputs = () => {
    const principal = parseFloat(parseInputValue(loanAmount)) || 0;
    const years = parseFloat(tenure) || 0;
    const interestRate = parseFloat(rate) || 0;

    if (principal < 1000000 || principal > 100000000) {
      setError('Loan amount must be between ₹10 Lakhs and ₹10 Crores');
      return false;
    }
    if (years < 1 || years > 30) {
      setError('Tenure must be between 1 and 30 years');
      return false;
    }
    if (interestRate <= 0 || interestRate > 100) {
      setError('Interest rate must be between 0.01% and 100%');
      return false;
    }
    setError('');
    return true;
  };

  // Calculate EMI, total interest, and total payment
  const calculateEMI = useCallback(() => {
    if (!validateInputs()) {
      setEmi('₹0');
      setTotalInterest(0);
      setFormattedInterest('₹0');
      setTotalPayment('₹0');
      return;
    }

    const principal = parseFloat(parseInputValue(loanAmount)) || 0;
    const monthlyRate = (parseFloat(rate) || 0) / 12 / 100;
    const months = (parseFloat(tenure) || 0) * 12;

    try {
      const emiValue =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

      if (!isFinite(emiValue)) throw new Error('Invalid EMI calculation');

      const totalPay = emiValue * months;
      const totalInt = totalPay - principal;

      setEmi(formatINR(emiValue));
      setTotalInterest(totalInt);
      setFormattedInterest(formatINR(totalInt));
      setTotalPayment(formatINR(totalPay));
    } catch (err) {
      setError('Calculation error. Please check your inputs.');
      setEmi('₹0');
      setTotalInterest(0);
      setFormattedInterest('₹0');
      setTotalPayment('₹0');
    }
  }, [loanAmount, tenure, rate]);

  // Debounce EMI calculations to prevent excessive updates
  const debouncedCalculateEMI = useCallback(debounce(calculateEMI, 300), [
    loanAmount,
    tenure,
    rate,
  ]);

  useEffect(() => {
    debouncedCalculateEMI();
  }, [loanAmount, tenure, rate, debouncedCalculateEMI]);

  // Handle input changes, storing raw numbers
  const handleLoanAmountChange = (val) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setLoanAmount(cleaned);
  };

  const handleTenureChange = (val) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setTenure(cleaned);
  };

  const handleRateChange = (val) => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const decimalCount = (cleaned.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    const parts = cleaned.split('.');
    if (parts[1] && parts[1].length > 2) return;
    setRate(cleaned);
  };

  // Reset inputs to default values
  const resetBtn = () => {
    Alert.alert(
      'Reset Values',
      'Are you sure you want to reset all inputs?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            setLoanAmount('5000000');
            setTenure('2');
            setRate('8.75');
            setError('');
            calculateEMI();
          },
        },
      ],
      { cancelable: true },
    );
  };

  // Render pie chart or placeholder
  const renderPieChart = () => {
    const principal = parseFloat(parseInputValue(loanAmount)) || 0;
    const interest = totalInterest >= 0 ? totalInterest : 0;

    if (principal <= 0 || interest <= 0 || error) {
      return (
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>
            {error || 'Enter valid values to see the chart'}
          </Text>
        </View>
      );
    }

    const series = [principal, interest];
    const sliceColor = ['#4CAF50', '#F44336'];

    return (
      <View style={styles.chartContainer}>
        <PieChart
          widthAndHeight={200}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.45}
          coverFill={'#FFF'}
        />
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Principal: {formatINR(principal)}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Interest: {formatINR(interest)}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Dismiss keyboard on tap outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
          <Navbar />
          <View style={styles.container}>
            <Text style={styles.title}>EMI Calculator</Text>

            {/* Input Section */}
            <View style={styles.inputSection}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              {/* Loan Amount */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Loan Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={formatInputValue(loanAmount)} // Display formatted value
                  onChangeText={handleLoanAmountChange}
                  placeholder="Enter loan amount"
                  accessible={true}
                  accessibilityLabel="Loan Amount"
                />
                <Text style={styles.rangeText}>₹10 Lakhs to ₹10 Crores</Text>
                <Text style={styles.inputFeedback}>
                  {loanAmount
                    ? `₹${Number(parseInputValue(loanAmount)).toLocaleString('en-IN')}`
                    : ''}
                </Text>
              </View>

              {/* Tenure */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Loan Tenure (Years)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={formatInputValue(tenure)} // Display formatted value
                  onChangeText={handleTenureChange}
                  placeholder="Enter tenure in years"
                  accessible={true}
                  accessibilityLabel="Loan Tenure"
                />
                <Text style={styles.rangeText}>1 to 30 years</Text>
              </View>

              {/* Interest Rate */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Interest Rate (%)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={rate} // Rate is unformatted
                  onChangeText={handleRateChange}
                  placeholder="Enter interest rate"
                  accessible={true}
                  accessibilityLabel="Interest Rate"
                />
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={resetBtn}
                accessible={true}
                accessibilityLabel="Reset Inputs"
              >
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Results Section */}
            <View style={styles.resultSection}>
              <Text style={styles.sectionTitle}>Loan Breakdown</Text>
              <View style={styles.resultBox}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Monthly EMI</Text>
                  <Text style={[styles.resultValue, styles.emiValue]}>{emi}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Total Interest Payable</Text>
                  <Text style={styles.resultValue}>{formattedInterest}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Total Payment</Text>
                  <Text style={styles.resultValue}>{totalPayment}</Text>
                </View>
              </View>
            </View>

            {/* Pie Chart Section */}
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Payment Breakdown</Text>
              {renderPieChart()}
            </View>
          </View>
          <Footer />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginVertical: 15,
    marginBottom: 25,
  },
  inputSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginVertical: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#34495e',
    fontSize: 16,
  },
  rangeText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputFeedback: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  resetBtn: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 20,
  },
  resetBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    paddingLeft: 5,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#34495e',
  },
  resultValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2c3e50',
  },
  emiValue: {
    fontSize: 18,
    color: '#27ae60',
  },
  chartSection: {
    marginBottom: 30,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
  },
  placeholderText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  legendContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});

export default Emicalculator;