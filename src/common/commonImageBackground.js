import {ImageBackground, StyleSheet} from 'react-native';
import React from 'react';
import Header from './Header';
import {BackGround, background, bg} from '../helper/image';
import { colors } from '../theme/color';

const CommonImageBackground = props => {
  const {children, common} = props;
  return (
    <>
      {common ? (
        <ImageBackground source={background} style={styles.image} resizeMode="cover">
          {children}
        </ImageBackground>
      ) : (
        <ImageBackground
          source={background}
          style={styles.image}
          resizeMode="cover">
          <Header />
          {children}
        </ImageBackground>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

export default CommonImageBackground;
