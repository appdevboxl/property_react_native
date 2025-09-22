import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Navbar from './Navbar';
import Footer from './Footer';

const { width } = Dimensions.get('window');

const SellPage = () => {
  // Blog/Update data
  const updates = [
    {
      id: '1',
      date: '25th Sep 2024',
      title: 'Our latest development projects by more efficie.',
      description:
        'Web development services include everything related to the creation and maintenance of a website. They range from simple static web pages to complex web applications, e-commerce sites, and enterprise-level platforms.',
      author: 'Robert Haven',
    },
    {
      id: '2',
      date: '1st Jan 2023',
      title: 'Choosing the Right Web Development Partner.',
      description:
        'Web development services include everything related to the creation and maintenance of a website. They range from simple static web pages to complex web applications, e-commerce sites, and enterprise-level platforms.',
      author: 'Robert Haven',
    },
    {
      id: '3',
      date: '31st Oct 2022',
      title: 'A Commitment to Service and Integrity.',
      description:
        'Web development services include everything related to the creation and maintenance of a website. They range from simple static web pages to complex web applications, e-commerce sites, and enterprise-level platforms.',
      author: 'Robert Haven',
    },
    {
      id: '4',
      date: '20th Feb 2021',
      title: 'Empowering Clients Through Expertise.',
      description:
        'Web development services include everything related to the creation and maintenance of a website. They range from simple static web pages to complex web applications, e-commerce sites, and enterprise-level platforms.',
      author: 'Robert Haven',
    },
  ];

  // Render breadcrumb item
  const renderBreadcrumbItem = (text, isLink, isLast) => (
    <View style={styles.breadcrumbItem}>
      {isLink ? (
        <TouchableOpacity onPress={() => console.log(`Navigate to ${text}`)}>
          <Text style={styles.breadcrumbLink}>{text}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.breadcrumbText}>{text}</Text>
      )}
      {!isLast && <Text style={styles.breadcrumbSeparator}> / </Text>}
    </View>
  );

  // Render blog/update item
  const renderUpdateItem = ({ item }) => (
    <View
      style={[
        styles.updateItem,
        width > 600 ? styles.updateItemLarge : styles.updateItemSmall,
      ]}
    >
      <Text style={styles.updateDate}>{item.date}</Text>
      <View style={styles.updateContent}>
        <TouchableOpacity onPress={() => console.log(`Navigate to ${item.title}`)}>
          <Text style={styles.updateTitle}>{item.title}</Text>
        </TouchableOpacity>
        <Text style={styles.updateDescription}>{item.description}</Text>
        <Text style={styles.updateAuthor}>
          By: <Text style={styles.updateAuthorName}>{item.author}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      {/* Breadcrumb Section */}
      <View style={styles.breadcrumbSection}>
        <View style={styles.breadcrumbContainer}>
          <View style={styles.breadcrumb}>
            {renderBreadcrumbItem('Home', true, false)}
            {renderBreadcrumbItem('Pages', true, false)}
            {renderBreadcrumbItem('Timeline', false, true)}
          </View>
          <Text style={styles.sectionTitle}>Timeline</Text>
        </View>
      </View>

      {/* Mission Section */}
      <View style={styles.missionSection}>
        <View style={styles.missionContainer}>
          <FlatList
            data={updates}
            renderItem={renderUpdateItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.updateList}
          />
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Breadcrumb Section
  breadcrumbSection: {
    backgroundColor: '#f3f4f6', // bg-gray-100
    padding: 20, // p-5
  },
  breadcrumbContainer: {
    maxWidth: 1152, // max-w-6xl
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16, // px-4
  },
  breadcrumb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12, // gap-3
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbLink: {
    fontSize: 14, // text-sm
    color: '#4b5563', // text-gray-600
    textDecorationLine: 'underline',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#111827', // text-gray-900
    fontWeight: '600',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#4b5563',
    marginHorizontal: 8, // space-x-2
  },
  sectionTitle: {
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    color: '#111827',
  },
  // Mission Section
  missionSection: {
    paddingVertical: 20, // py-16
    paddingHorizontal: 16, // px-4
  },
  missionContainer: {
    maxWidth: 1152, // max-w-6xl
    width: '100%',
    alignSelf: 'center',
  },
  updateList: {
    paddingHorizontal: 8,
  },
  updateItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // border-b
    paddingBottom: 24, // pb-6
    marginBottom: 24,
  },
  updateItemLarge: {
    flexDirection: 'row', // md:flex-row
    alignItems: 'flex-start',
  },
  updateItemSmall: {
    flexDirection: 'column',
  },
  updateDate: {
    fontSize: 16,
    color: '#6b7280',  
    fontWeight: '600',
    marginBottom: 8,
    width: width > 600 ? '25%' : '100%',  
  },
  updateContent: {
    width: width > 600 ? '75%' : '100%',  
  },
  updateTitle: {
    fontSize: 18,  
    fontWeight: '600',
    color: '#1f2937',  
    marginBottom: 8, 
  },
  updateDescription: {
    fontSize: 16,
    color: '#4b5563',  
    marginBottom: 8,
    lineHeight: 24,
  },
  updateAuthor: {
    fontSize: 14, // text-sm
    color: '#6b7280', // text-gray-500
  },
  updateAuthorName: {
    fontWeight: '500',
  },
});

export default SellPage;