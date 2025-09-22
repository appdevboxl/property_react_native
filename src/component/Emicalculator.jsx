import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Navbar from './Navbar';
import Footer from './Footer';

const { width } = Dimensions.get('window');

const Emicalculator = () => {
  const [loanAmount, setLoanAmount] = useState('5000000');
  const [tenure, setTenure] = useState('2');
  const [rate, setRate] = useState('8.75');
  const [emi, setEmi] = useState('₹0');
  const [totalInterest, setTotalInterest] = useState(0);
  const [formattedInterest, setFormattedInterest] = useState('₹0');
  const [totalPayment, setTotalPayment] = useState('₹0');

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, tenure, rate]);

  const formatINR = (num) => {
    const number = parseFloat(num);
    if (isNaN(number) || number <= 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(number));
  };

  const formatInputValue = (value, isRate = false) => {
    if (value === '') return '';
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (isRate) return numericValue; // Keep raw for rate (with decimal)
    return parseFloat(numericValue).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
  };

  const parseInputValue = (value) => {
    return value.replace(/,/g, '');
  };

  const calculateEMI = () => {
    const principal = parseFloat(parseInputValue(loanAmount)) || 0;
    const monthlyRate = (parseFloat(rate) || 0) / 12 / 100;
    const months = (parseFloat(tenure) || 0) * 12;

    if (principal <= 0 || months <= 0 || monthlyRate <= 0) {
      setEmi('₹0');
      setTotalInterest(0);
      setFormattedInterest('₹0');
      setTotalPayment('₹0');
      return;
    }

    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPay = emiValue * months;
    const totalInt = totalPay - principal;

    setEmi(formatINR(emiValue));
    setTotalInterest(totalInt);
    setFormattedInterest(formatINR(totalInt));
    setTotalPayment(formatINR(totalPay));
  };

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
    if (parts[1] && parts[1].length > 2) return; // Limit to 2 decimal places
    setRate(cleaned);
  };

  const resetBtn = () => {
    setLoanAmount('5000000');
    setTenure('2');
    setRate('8.75');
    calculateEMI();
  };

  const chartData = [
    {
      name: 'Principal',
      population: parseFloat(parseInputValue(loanAmount)) || 0,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Interest',
      population: totalInterest >= 0 ? totalInterest : 0,
      color: '#F44336',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  };

  const renderPieChart = () => {
    const principal = parseFloat(parseInputValue(loanAmount)) || 0;
    if (principal <= 0 || totalInterest <= 0) {
      return (
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>
            Enter valid values to see the chart
          </Text>
        </View>
      );
    }
    return (
      <PieChart
        data={chartData}
        width={width - 40}
        height={200}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
      />
    );
  };

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
              {/* Loan Amount */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Loan Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={formatInputValue(loanAmount)}
                  onChangeText={handleLoanAmountChange}
                  placeholder="Enter loan amount"
                />
                <Text style={styles.rangeText}>₹10 Lakhs to ₹10 Crores</Text>
                <Text style={styles.inputFeedback}>
                  {loanAmount
                    ? `₹${Number(parseInputValue(loanAmount)).toLocaleString(
                        'en-IN',
                      )}`
                    : ''}
                </Text>
              </View>

              {/* Tenure */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Loan Tenure (Years)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={tenure}
                  onChangeText={handleTenureChange}
                  placeholder="Enter tenure in years"
                />
                <Text style={styles.rangeText}>1 to 30 years</Text>
              </View>

              {/* Interest Rate */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Interest Rate (%)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={rate}
                  onChangeText={handleRateChange}
                  placeholder="Enter interest rate"
                />
              </View>

              {/* Reset Button */}
              <TouchableOpacity style={styles.resetBtn} onPress={resetBtn}>
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Results Section */}
            <View style={styles.resultSection}>
              <Text style={styles.sectionTitle}>Loan Breakdown</Text>
              <View style={styles.resultBox}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Monthly EMI</Text>
                  <Text style={[styles.resultValue, styles.emiValue]}>
                    {emi}
                  </Text>
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
});

export default Emicalculator;