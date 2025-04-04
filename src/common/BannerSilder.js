import React, {useRef, useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Screen} from '../theme/dimens';
import FastImage from "@d11/react-native-fast-image";
import {IMAGE_BASE_URL} from '../helper/utility';
import {BannerLoop, ContextBg} from '../helper/image';

const BannerSlider = ({bannerData}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // const bannerData = [
  //   {
  //     id: '1',
  //     image: BannerLoop,
  //   },
  //   {
  //     id: '2',
  //     image: BannerLoop,
  //   },
  //   {
  //     id: '3',
  //     image: BannerLoop,
  //   },
  // ];
  const carousel = useRef(null);
  // const renderItem = ({item, index}: any) => {
  //   return (
  //     <View style={{width: Screen.Width - 75, height: 80}} key={index}>
  //       <FastImage
  //         resizeMode={'stretch'}
  //         style={styles.bannerStyle}
  //         source={{uri: `https://admin.mybattle11.com/uploads/${item?.bannerPath}`}}
  //       />
  //     </View>
  //   );
  // };
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <ImageBackground
          source={{uri: `https://admin.mybattle11.com/uploads/${item?.bannerPath}`}}
          style={styles.image}
          resizeMode="contain"        >
        </ImageBackground>
      </View>
    );
  };
 
  return (
    <View style={{ height: 150, alignSelf: "center", alignItems: "center", }}>
      <Carousel
         ref={carousel}
         data={bannerData}
         renderItem={renderItem}
         sliderWidth={Screen?.Width}
         itemWidth={Screen?.Width}
         autoplay={true}
         autoplayDelay={500}
         autoplayInterval={2500}
         loop={true}
         onSnapToItem={(index) => {
           setActiveIndex(index);
         }}
      />
      <Pagination
        dotsLength={bannerData?.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dot}
        inactiveDotOpacity={0.2}
        inactiveDotScale={0.7}
        inactiveDotStyle={styles.inactiveDot}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  first: {
    height: 170,
    marginTop: 10,
  },
  bannerView: {
    height: 80,
    borderRadius: 20,
  },
  bannerStyle: {
    height: 60,
    borderRadius: 10,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    width: 10,
  },
  dot: {
    width: 12,
    height: 4,
    backgroundColor: "#010101",
  },
  inactiveDot: {
    width: 6,
    height: 4,
  },
  image: {
    width: "90%",
    height: "100%",
    marginLeft: 25
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
});
export default BannerSlider;
