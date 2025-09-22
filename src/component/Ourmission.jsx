import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Navbar from './Navbar';
import Footer from './Footer';

const { width } = Dimensions.get('window');

const SellPage = () => {
  // Navigation links for sidebar
  const navLinks = [
    { title: 'About Us', route: 'About' },
    { title: 'Mission', route: 'Mission' },
    { title: 'Our Services', route: 'Services' },
    { title: 'Browse', route: 'Browse' },
    { title: 'Contact', route: 'Contact' },
    { title: 'Timeline', route: 'Timeline' },
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

  // Render sidebar navigation item
  const renderNavItem = ({ title, route }) => (
    <TouchableOpacity
      key={route}
      style={styles.navItem}
      onPress={() => console.log(`Navigate to ${route}`)}
    >
      <Text style={styles.navLink}>{title}</Text>
    </TouchableOpacity>
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
            {renderBreadcrumbItem('Our Mission', false, true)}
          </View>
          <Text style={styles.sectionTitle}>Our Mission</Text>
        </View>
      </View>

      {/* Mission Section */}
      <View style={styles.missionSection}>
        <View style={styles.missionContainer}>
          {/* Sidebar Navigation */}
          {/* <View
            style={[
              styles.sidebar,
              width > 600 ? styles.sidebarLarge : styles.sidebarSmall,
            ]}
          >
            <View style={styles.sidebarCard}>
              <Text style={styles.sidebarTitle}>Navigation</Text>
              {navLinks.map(renderNavItem)}
            </View>
          </View> */}

          {/* Mission Content */}
          <View
            style={[
              styles.content,
              width > 600 ? styles.contentLarge : styles.contentSmall,
            ]}
          >
            <View style={styles.contentSection}>
              <Text style={styles.contentTitle}>Mission Statement</Text>
              <Text style={styles.contentText}>
                In an industry built on trust, relationships, and long-term
                investment, a clear and compelling mission statement is more than
                just a corporate formality: it's the heart of a real estate
                agency. Whether it's first-time homebuyers, seasoned investors, or
                commercial clients, a real estate agency's mission is its North
                Star, guiding every transaction, decision, and interaction.
              </Text>
            </View>

            <View style={styles.contentSection}>
              <Text style={styles.contentTitle}>Property Construction Terms</Text>
              <Text style={styles.contentText}>
                At its core, the mission of a real estate agency is to provide
                exceptional service based on honesty, transparency, and
                professionalism. Buying or selling a home is one of the most
                important financial decisions in a person's life, and clients
                deserve a partner who not only understands the market but also
                values their goals and concerns.
              </Text>
              <Text style={styles.contentText}>
                By engaging in ethical practices and maintaining the highest
                standards of integrity, real estate agencies build lasting
                relationships based on trust. This foundation is essential in an
                industry where referrals, reputation, and loyalty are vital to
                long-term success.
              </Text>
              <Text style={styles.contentText}>
                A real estate agency's mission often emphasizes empowerment. This
                means providing clients with the knowledge and support they need
                to make informed decisions. Whether navigating complex zoning
                regulations, evaluating market trends, or negotiating contracts,
                clients rely on expert guidance to avoid pitfalls and seize
                opportunities.
              </Text>
            </View>

            <View style={styles.blockquote}>
              <Text style={styles.blockquoteText}>
                An effective real estate agency does more than simply close deals;
                it educates, advises, and advocates for its clients. This approach
                transforms transactions into partnerships and builds trust that
                lasts even after the sale.
              </Text>
            </View>

            <Text style={styles.contentText}>
              In today's fast-paced world, the real estate industry is constantly
              evolving. The most successful companies embrace innovation and adapt
              to new technologies, market conditions, and customer expectations. A
              mission that includes a commitment to innovation ensures the company
              remains competitive, efficient, and forward-thinking.
            </Text>

            <Text style={styles.contentText}>
              From digital marketing strategies to virtual tours and AI-powered
              analytics, modern tools are helping real estate professionals
              provide you with better service and streamline the buying and
              selling process. A mission-driven company views change not as a
              challenge, but as an opportunity for improvement.
            </Text>
          </View>
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
    paddingVertical: 20, // py-16
    paddingHorizontal: 16,
  },
  missionContainer: {
    maxWidth: 1280, // max-w-7xl
    width: '100%',
    alignSelf: 'center',
    flexDirection: width > 600 ? 'row' : 'column', // md:grid-cols-12
    gap: 40, // gap-10
  },
  sidebar: {
    marginBottom: 24,
  },
  sidebarLarge: {
    flex: 4 / 12, // md:col-span-4
  },
  sidebarSmall: {
    width: '100%',
  },
  sidebarCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  navItem: {
    paddingVertical: 8,
  },
  navLink: {
    fontSize: 16,
    color: '#4b5563', // text-gray-700
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
  },
  contentLarge: {
    flex: 8 / 12, // md:col-span-8
  },
  contentSmall: {
    width: '100%',
  },
  contentSection: {
    marginBottom: 24,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#4b5563', // text-gray-700
    marginBottom: 12,
    lineHeight: 24,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#ca8a04', // text-primary (yellow-600)
    paddingLeft: 16,
    marginVertical: 16,
  },
  blockquoteText: {
    fontSize: 16,
    color: '#1f2937', // text-gray-800
    fontStyle: 'italic',
    fontWeight: '500',
  },
});

export default SellPage;