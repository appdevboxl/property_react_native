import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Navbar from "./Navbar";

const Emicalculator = () => {
  const [loan, setLoan] = useState("500000");
  const [rate, setRate] = useState("8.75");
  const [tenure, setTenure] = useState("5");

  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);

  const calculateEMI = () => {
    const principal = parseFloat(loan) || 0;
    const annualRate = parseFloat(rate) || 0;
    const years = parseFloat(tenure) || 0;

    if (!principal || !annualRate || !years) {
      setEmi("Invalid Input");
      setTotalInterest(null);
      setTotalPayment(null);
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPay = emiValue * months;
    const totalInt = totalPay - principal;

    setEmi(emiValue.toFixed(2));
    setTotalPayment(totalPay.toFixed(2));
    setTotalInterest(totalInt.toFixed(2));
  };

  // Pie chart percentage
  const getChartStyles = () => {
    if (!totalPayment || !totalInterest) return {};
    const principal = parseFloat(loan);
    const interest = parseFloat(totalInterest);
    const total = principal + interest;

    const interestPercent = (interest / total) * 100;

    return {
      backgroundColor: "transparent",
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundImage: `conic-gradient(#4CAF50 ${100 - interestPercent}%, #F44336 0)`,
    };
  };

  return (

    <>
    <Navbar />
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>EMI Calculator</Text>

      {/* Loan Amount */}
      <TextInput
        style={styles.input}
        placeholder="Loan Amount"
        keyboardType="numeric"
        value={loan}
        onChangeText={setLoan}
      />

      {/* Interest Rate */}
      <TextInput
        style={styles.input}
        placeholder="Interest Rate (%)"
        keyboardType="numeric"
        value={rate}
        onChangeText={setRate}
      />

      {/* Tenure */}
      <TextInput
        style={styles.input}
        placeholder="Tenure (Years)"
        keyboardType="numeric"
        value={tenure}
        onChangeText={setTenure}
      />

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={calculateEMI}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      {/* Results */}
      {emi && (
        <View style={styles.results}>
          <Text style={styles.resultText}>Monthly EMI: ₹{emi}</Text>
          <Text style={styles.resultText}>
            Total Interest: ₹{totalInterest}
          </Text>
          <Text style={styles.resultText}>Total Payment: ₹{totalPayment}</Text>
        </View>
      )}

      {/* Pie Chart */}
      {emi && (
        <View style={styles.chartWrapper}>
          <View style={[styles.chartCircle, getChartStyles()]} />
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
            <Text>Principal</Text>
            <View style={[styles.legendDot, { backgroundColor: "#F44336" }]} />
            <Text>Interest</Text>
          </View>
        </View>
      )}
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#af9b53ff",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
    width: "100%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  results: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "100%",
  },
  resultText: { fontSize: 16, marginVertical: 5, fontWeight: "600" },
  chartWrapper: { marginTop: 30, alignItems: "center" },
  chartCircle: {
    borderRadius: 100,
    width: 200,
    height: 200,
    backgroundColor: "#ddd",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },
  legendDot: { width: 15, height: 15, borderRadius: 7 },
});

export default Emicalculator;
