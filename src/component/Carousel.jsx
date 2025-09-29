import React, { useRef, useState } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  { id: '2', uri: 'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg' },
  { id: '1', uri: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fGhvbWV8ZW58MHx8MHx8fDA%3D' },
  { id: '3', uri: 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGhvbWV8ZW58MHx8MHx8fDA%3D' },
];

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}  
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.image} />
        )}
        />
        <View style={styles.dots}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? '#aa8453' : 'gray' },
              ]}
            />
          ))}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 320,  
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
});
