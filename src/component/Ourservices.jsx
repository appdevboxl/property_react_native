import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Navbar from './Navbar';
import Footer from './Footer';

const { width } = Dimensions.get('window');

const Ourservices = () => {
  // Sample data for the services cards
  const services = [
    {
      id: '1',
      title: 'Instalment Booking',
      description:
        'Property installment booking, also known as property installment plan or property installment scheme',
      image: require('../../public/assets/images/icon/playground.png'),
    },
    {
      id: '2',
      title: 'Property Management',
      description:
        'Hiring a property management company allows owners to focus on other aspects of their lives or invest their time',
      image: require('../../public/assets/images/icon/office-building.png'),
    },
    {
      id: '3',
      title: 'Architect Designing',
      description:
        'In general, the real estate industry does involve memberships and associations that professionals can join to gain access',
      image: require('../../public/assets/images/icon/architect.png'),
    },
    {
      id: '4',
      title: 'House Development',
      description:
        'The most successful companies embrace innovation and adapt to new market conditions and customer expectations',
      image: require('../../public/assets/images/icon/architect.png'),
    },
    {
      id: '5',
      title: 'Advertisement',
      description:
        'A mission that includes a commitment to innovation ensures the company remains efficient and forward-thinking.',
      image: require('../../public/assets/images/icon/advertisement.png'),
    },
    {
      id: '6',
      title: 'Broker Agent',
      description:
        'Homebuyers are increasingly looking for properties equipped with smart devices and automation systems.',
      image: require('../../public/assets/images/icon/broker.png'),
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

  // Render service card
  const renderServiceCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardImageContainer}>
        <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <TouchableOpacity onPress={() => console.log(`Read more about ${item.title}`)}>
        <Text style={styles.cardLink}>Read More</Text>
      </TouchableOpacity>
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
            {renderBreadcrumbItem('Our Services', false, true)}
          </View>
          <Text style={styles.sectionTitle}>Our Services</Text>
        </View>
      </View>

      {/* Mission Section */}
      <View style={styles.missionSection}>
        <View style={styles.missionHeader}>
          <Text style={styles.missionTitle}>What You Are Looking For?</Text>
          <Text style={styles.missionDescription}>
            Selling a property is not just about placing a "For Sale" sign in the front yard and hoping for the best. In
            today's competitive real estate market, a well-crafted listing is a powerful tool that can make all the
            difference in attracting potential buyers and ultimately.
          </Text>
        </View>

        {/* Grid Items */}
        <FlatList
          data={services}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.id}
          numColumns={width > 600 ? 3 : 1} // Responsive: 3 columns for tablets, 1 for phones
          columnWrapperStyle={width > 600 ? styles.gridRow : null}
          contentContainerStyle={styles.gridContainer}
        />
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  breadcrumbContainer: {
    maxWidth: 1280, // max-w-7xl
    width: '100%',
    alignSelf: 'center',
  },
  breadcrumb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbLink: {
    fontSize: 14,
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
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
  },
  // Mission Section
  missionSection: {
    paddingVertical: 48,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  missionHeader: {
    alignItems: 'center',
    marginBottom: 32,
    maxWidth: 700, // lg:w-7/12
    alignSelf: 'center',
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  missionDescription: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
  gridContainer: {
    paddingHorizontal: 8,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#f9fafb', // bg-gray-50
    borderRadius: 12,
    padding: 24,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flex: width > 600 ? 1 : undefined, // For grid layout on larger screens
  },
  cardImageContainer: {
    marginBottom: 16,
  },
  cardImage: {
    width: 64,
    height: 64,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardLink: {
    fontSize: 14,
    color: '#ca8a04', // text-yellow-600
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default Ourservices;