import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import Colors from '../assets/colors/Colors';
import { IMAGES } from '../theme/assets';
import { COLORS } from '../theme/constant';
import { getResponsiveSize } from '../utils';

const ImageSlider = () => {
  const images = IMAGES.sliderImage

  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    console.log(newIndex);
    setActiveIndex(newIndex);
  };

  const Dots = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 25 }}>
        {
          images.map((image, index) => (
            <View
              key={index}
              style={{
                borderColor: Colors.primaryColor,
                borderWidth: 1,
                borderRadius: 20,
                padding: 5,
                backgroundColor: activeIndex === index ? COLORS.themeBlue : 'white', marginHorizontal: 8,
              }} />
          ))
        }
      </View>
    )
  }


  const SCREEN_WIDTH = Dimensions.get('window').width;

  return (
    <View style={{}}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => handleScroll(event)}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            style={{ width: SCREEN_WIDTH, height: getResponsiveSize(45).height, resizeMode: 'cover', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
            source={image}
          />
        ))}
      </ScrollView>
      <Dots />
      {/* <Text style={{ textAlign: 'center' }}>
        {activeIndex + 1} / {images.length}
      </Text> */}
    </View>
  );
};

export default ImageSlider;
