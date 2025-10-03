import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

// Main EMI Calculator component (no external npm libs)
const Emicalculator = () => {
  const [loan, setLoan] = useState("500000");
  const [rate, setRate] = useState("8.75");
  const [tenure, setTenure] = useState("5");
  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [chartData, setChartData] = useState(null);

  const calculateEMI = () => {
    const principal = parseFloat(loan) || 0;
    const annualRate = parseFloat(rate) || 0;
    const years = parseFloat(tenure) || 0;

    if (!principal || !annualRate || !years) {
      setEmi("Invalid Input");
      setTotalInterest(null);
      setTotalPayment(null);
      setChartData(null);
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

    // prepare chart data
    const newChartData = {
      principal,
      interest: totalInt,
      total: totalPay,
      principalPercentage: principal / totalPay * 100,
      interestPercentage: totalInt / totalPay * 100,
    };
    setChartData(newChartData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>EMI Calculator</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Loan Amount (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="500000"
          keyboardType="numeric"
          value={loan}
          onChangeText={setLoan}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Interest Rate (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="8.75"
          keyboardType="numeric"
          value={rate}
          onChangeText={setRate}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tenure (Years)</Text>
        <TextInput
          style={styles.input}
          placeholder="5"
          keyboardType="numeric"
          value={tenure}
          onChangeText={setTenure}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateEMI}>
        <Text style={styles.buttonText}>Calculate EMI</Text>
      </TouchableOpacity>

      

      {chartData && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Payment Distribution</Text>
          <CustomPieChart data={chartData} size={Math.min(300, Dimensions.get('window').width - 80)} />
        </View>
      )}
      {emi && (
        <View style={styles.results}>
          <Text style={styles.sectionTitle}>EMI Breakdown</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Monthly EMI:</Text>
            <Text style={styles.resultValue}>₹{emi}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Principal Amount:</Text>
            <Text style={styles.resultValue}>
              ₹{parseFloat(loan).toLocaleString("en-IN")}
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Interest:</Text>
            <Text style={styles.resultValue}>₹{parseFloat(totalInterest).toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Payment:</Text>
            <Text style={styles.resultValue}>₹{parseFloat(totalPayment).toLocaleString("en-IN")}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// CustomPieChart: draws a donut chart WITHOUT npm
// Strategy: draw a full green circle as the base (principal).
// Then overlay the interest portion as red rotated overlays.
// Also places principal & total in center, and places an interest label on the red slice.
const CustomPieChart = ({ data, size = 220 }) => {
  const radius = size / 2;
  const center = { x: radius, y: radius };

  // angles
  const principalAngle = (data.principalPercentage / 100) * 360; // degrees
  const interestAngle = 360 - principalAngle;

  // For placing the interest label approximately inside the red slice,
  // compute the slice's mid angle (in deg) measured from 0deg (right direction)
  // NOTE: our drawing rotates from 0deg (right, clockwise). We will assume 0deg at right.
  const interestMidAngleDeg = principalAngle + interestAngle / 2;
  const degToRad = (d) => (d - 90) * (Math.PI / 180); // offset to place 0deg at top like RN rotate transforms
  // we subtract 90 so 0deg points upward for positioning convenience

  // label radius inside slice (closer to donut ring)
  const labelRadius = radius * 0.65;

  const interestLabelPos = {
    left: center.x + labelRadius * Math.cos((interestMidAngleDeg) * Math.PI / 180) - 40, // -40 to roughly center label
    top: center.y + labelRadius * Math.sin((interestMidAngleDeg) * Math.PI / 180) - 10,
  };

  // we will draw the base circle as green (principal)
  // then overlay the interest as red semicircle(s) rotated to start from principalAngle
  // If interestAngle <= 180 => one overlay; if > 180 => two overlays to cover full arc.
  const interestOverlays = useMemo(() => {
    const overlays = [];
    // we use 'halfOverlay' elements (a circle-shaped view) rotated so a semicircle shows as wedge
    if (interestAngle <= 0) return overlays;
    if (interestAngle <= 180) {
      overlays.push({
        rotateDeg: principalAngle,
      });
    } else {
      // cover >180 by using two half overlays:
      overlays.push({ rotateDeg: principalAngle }); // covers first up to 180
      // second overlay rotated by principalAngle + 180 will cover remaining portion
      overlays.push({ rotateDeg: principalAngle + 180 });
    }
    return overlays;
  }, [principalAngle, interestAngle]);

  return (
    <View style={[styles.pieChartContainer, { width: size, alignItems: 'center' }]}>
      <View style={[styles.pieChartWrapper, { width: size, height: size }]}>
        {/* Base circle (green) representing Principal */}
        <View
          style={[
            styles.baseCircle,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: "#adacaa", // green principal base
            },
          ]}
        />

        {/* Red overlay(s) for Interest */}
        {interestOverlays.map((ov, idx) => (
          <View
            key={`ov-${idx}`}
            style={[
              styles.overlayWrapper,
              {
                width: size,
                height: size,
                borderRadius: radius,
                position: 'absolute',
                top: 0,
                left: 0,
                transform: [{ rotate: `${ov.rotateDeg}deg` }],
                overflow: 'hidden',
              },
            ]}
          >
            {/* inside overlay, place a rectangle that covers half the circle (right half),
                so after rotation it appears as a wedge */}
            <View
              style={{
                position: 'absolute',
                left: radius,
                top: 0,
                width: radius,
                height: size,
                backgroundColor: "#aa8453", // red interest
              }}
            />
          </View>
        ))}

        {/* Donut Hole */}
        <View
          style={[
            styles.pieCenterHole,
            {
              width: size - 80,
              height: size - 80,
              borderRadius: (size - 80) / 2,
            },
          ]}
        />

        {/* Center content: show Principal and Total */}
        <View style={styles.pieCenterContent}>
          <Text style={styles.pieCenterTitle}>Principal</Text>
          <Text style={styles.pieCenterAmount}>
            ₹{data.principal.toLocaleString("en-IN")}
          </Text>
          <Text style={[styles.pieCenterTitle, { marginTop: 6 }]}>Total</Text>
          <Text style={styles.pieCenterAmount}>
            ₹{Math.round(data.total).toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Interest label placed approximately on the red slice */}
        {interestAngle > 0 && (
          <View style={[styles.interestLabelContainer, interestLabelPos]}>
            <Text style={styles.interestLabelText}>
              ₹{Math.round(data.interest).toLocaleString("en-IN")}
            </Text>
          </View>
        )}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#adacaa" }]} />
          <View style={styles.legendTextContainer}>
            <Text style={styles.legendLabel}>Principal Amount</Text>
            <Text style={styles.legendValue}>
              ₹{Math.round(data.principal).toLocaleString("en-IN")} ({data.principalPercentage.toFixed(1)}%)
            </Text>
          </View>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#aa8453" }]} />
          <View style={styles.legendTextContainer}>
            <Text style={styles.legendLabel}>Interest Amount</Text>
            <Text style={styles.legendValue}>
              ₹{Math.round(data.interest).toLocaleString("en-IN")} ({data.interestPercentage.toFixed(1)}%)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 8,
    color: "#333",
    textAlign: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#af9b53ff",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  results: {
    marginTop: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultLabel: { fontSize: 15, color: "#666", fontWeight: "600" },
  resultValue: { fontSize: 15, fontWeight: "700", color: "#333" },

  chartContainer: {
    marginTop: 18,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // PIE styles
  pieChartContainer: {
    alignItems: "center",
  },
  pieChartWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  baseCircle: {
    position: "absolute",
  },
  overlayWrapper: {
    // circular wrapper where inner half rectangle creates the wedge after rotation
    position: "absolute",
  },
  pieCenterHole: {
    position: "absolute",
    backgroundColor: "#fff",
  },
  pieCenterContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  pieCenterTitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  pieCenterAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
    marginTop: 2,
  },

  interestLabelContainer: {
    position: "absolute",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    // give a subtle readable background
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: "#ddd",
  },
  interestLabelText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F44336",
  },

  // Legend
  legend: {
    marginTop: 6,
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  legendValue: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
});

export default Emicalculator;
