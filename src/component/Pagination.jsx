import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Pagination = ({ data, itemsPerPage = 5, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / itemsPerPage));
    setCurrentPage(1);
  }, [data, itemsPerPage]);

  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    onPageChange(data.slice(start, end), currentPage, itemsPerPage);
  }, [currentPage, data, itemsPerPage, ]);

  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={goToPrevPage}
        disabled={currentPage === 1}
        style={[styles.btn, currentPage === 1 && styles.disabled]}
      >
        <Text style={styles.btnText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToFirstPage} style={styles.btn}>
        <Text style={styles.btnText}>First</Text>
      </TouchableOpacity>

      <View style={styles.active}>
        <Text style={styles.activeText}>
          {currentPage} of {totalPages}
        </Text>
      </View>

      <TouchableOpacity onPress={goToLastPage} style={styles.btn}>
        <Text style={styles.btnText}>Last</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={goToNextPage}
        disabled={currentPage === totalPages}
        style={[styles.btn, currentPage === totalPages && styles.disabled]}
      >
        <Text style={styles.btnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    flexWrap: "wrap",
  },
  btn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btnText: {
    color: "#333",
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
  active: {
    backgroundColor: "#aa8453",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
