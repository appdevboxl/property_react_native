import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import myurl from "../../utils/data";
const PropertyFilter = ({ setProperties, properties, getToggleFilter, setToggleFilter }) => {
  const [getAmenity, setAmenity] = useState([]);
  const [getLocation, setLocation] = useState([]);
  const [getany, setany] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    propertyStatus: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    area: "",
    options: [],
  });

  useEffect(() => {
    FetchAmenity();
  }, []);



  const handleChange = (name, value, type = "text") => {
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        options: value.checked
          ? [...prev.options, value.val]
          : prev.options.filter((opt) => opt !== value.val),
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const FetchAmenity = async () => {
    try {
      const resAmenity = await fetch(`http://${myurl.BASE_URL}/api/admin/amenities`);
      const mydata = await resAmenity.json();
      setAmenity(mydata.myamenity || []);

      const resLocation = await fetch(`http://${myurl.BASE_URL}/api/admin/getlocation`);
      const myloc = await resLocation.json();
      setLocation(myloc.mylocation || []);
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleSubmit = async () => {
    console.log("Filters Applied:", filters);
    try {
      const res = await fetch(`http://${myurl.BASE_URL}/api/admin/filterproperty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data = await res.json();
      setProperties(data.myproperty);
      if (!res.ok) throw new Error(data.message || "Failed to filter");
      Alert.alert("Success", "Successfully filtered");
          setToggleFilter(!getToggleFilter);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setFilters({
      location: "",
      propertyType: [],
      propertyStatus: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      area: "",
      options: "",
    });
    setany(false);
  };

  console.log("Current Filters:", filters);

  return (
    <ScrollView style={[styles.container, !getToggleFilter && { display: 'flex' }]}>
      <TouchableOpacity onPress={() => setToggleFilter(!getToggleFilter)} style={styles.closeBtn}>
        <Text style={styles.closeText}>&times;</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Location</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={filters.location}
          onValueChange={(value) => handleChange("location", value)}
        >
          <Picker.Item label="Select location" value="" />
          {getLocation.map((loc, i) => (
            <Picker.Item key={i} label={loc.location} value={loc.location} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Property Type</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.typeBtn, getany && styles.typeBtnActive]}
          onPress={() => setany(!getany)}
        >
          <Text style={getany ? styles.typeBtnTextActive : styles.typeBtnText}>Any Type</Text>
        </TouchableOpacity>
        {["Apartment", "Plot", "Condos", "Villa", "Family", "Single Room"].map((type) => {
          const isSelected = filters.propertyType.includes(type);
          return (
            <TouchableOpacity
              key={type}
              style={[styles.typeBtn, isSelected && styles.typeBtnActive]}
              onPress={() =>
                setFilters((prev) => {
                  let updatedTypes = [...prev.propertyType];
                  if (updatedTypes.includes(type)) {
                    updatedTypes = updatedTypes.filter((t) => t !== type);
                  } else {
                    updatedTypes.push(type);
                  }
                  return { ...prev, propertyType: updatedTypes };
                })
              }
            >
              <Text style={isSelected ? styles.typeBtnTextActive : styles.typeBtnText}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Property Pricing</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Min Price"
          keyboardType="numeric"
          value={filters.minPrice}
          onChangeText={(value) => handleChange("minPrice", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Max Price"
          keyboardType="numeric"
          value={filters.maxPrice}
          onChangeText={(value) => handleChange("maxPrice", value)}
        />
      </View>

      <Text style={styles.label}>Bedrooms</Text>
      <View style={styles.buttonContainer}>
        {["One", "Two", "Three", "Four", "Five", "Six"].map((bed) => {
          const isSelected = filters.bedrooms.includes(bed);
          return (
            <TouchableOpacity
              key={bed}
              style={[styles.typeBtn, isSelected && styles.typeBtnActive]}
              onPress={() =>
                setFilters((prev) => {
                  let updatedBeds = [...prev.bedrooms];
                  if (updatedBeds.includes(bed)) {
                    updatedBeds = updatedBeds.filter((b) => b !== bed);
                  } else {
                    updatedBeds.push(bed);
                  }
                  return { ...prev, bedrooms: updatedBeds };
                })
              }
            >
              <Text style={isSelected ? styles.typeBtnTextActive : styles.typeBtnText}>{bed}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Area Square Feet</Text>
      <View style={styles.buttonContainer}>
        {["0-1000 sqft", "1001-3000 sqft", "3001-5000 sqft", "5001-8000 sqft+"].map((area) => {
          const isSelected = filters.area.includes(area);
          return (
            <TouchableOpacity
              key={area}
              style={[styles.typeBtn, isSelected && styles.typeBtnActive]}
              onPress={() =>
                setFilters((prev) => {
                  let updatedAreas = [...prev.area];
                  if (isSelected) updatedAreas = updatedAreas.filter((a) => a !== area);
                  else updatedAreas.push(area);
                  return { ...prev, area: updatedAreas };
                })
              }
            >
              <Text style={isSelected ? styles.typeBtnTextActive : styles.typeBtnText}>{area}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Additional Options</Text>
      <View style={styles.optionsContainer}>
        {getAmenity.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.checkboxContainer}
            onPress={() =>
              handleChange("options", { val: option.amenities, checked: !filters.options.includes(option.amenities) }, "checkbox")
            }
          >
            <View style={[styles.checkbox, filters.options.includes(option.amenities) && styles.checkboxChecked]} />
            <Text style={styles.optionText}>{option.amenities}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1f1f1f', padding: 15,width:250 },
  closeBtn: { position: 'absolute', top: -10, right: 0,padding: 5,zIndex:1 },
  closeText: { fontSize: 24, color: 'white' },
  label: { color: 'white', fontSize: 16, marginVertical: 10 },
  pickerContainer: { backgroundColor: 'white', borderRadius: 5, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  input: { flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 5, color: 'black' },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  typeBtn: { borderWidth: 1, borderColor: 'gray', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 5 },
  typeBtnActive: { backgroundColor: '#aa8453', borderColor: '#aa8453' },
  typeBtnText: { color: 'white' },
  typeBtnTextActive: { color: 'white' },
  optionsContainer: { marginBottom: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: 'gray', marginRight: 10 },
  checkboxChecked: { backgroundColor: '#aa8453', borderColor: '#aa8453' },
  optionText: { color: 'white' },
  actionButtons: { marginVertical: 10 },
  submitBtn: { backgroundColor: '#aa8453', paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
  submitText: { color: 'white', fontSize: 16 },
  resetText: { color: 'gray', textAlign: 'center', textDecorationLine: 'underline', marginTop: 10 },
});

export default PropertyFilter;
