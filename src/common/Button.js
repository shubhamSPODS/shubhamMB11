import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppText,
  ELEVEN,
  FORTEEN,
  POPPINS,
  POPPINS_EXTRA_BOLD_ITALIC,
  SIXTEEN,
  POPPINS_BOLD,
  BLACK,
} from './AppText';
import {TouchableOpacityView} from './TouchableOpacityView';
import {useSelector} from 'react-redux';

const Button = ({
  onPress,
  children,
  activeOpacity,
  disabled = false,
  color,
  size,
  weight,
  backgroundColor,
  nogradient,
  style,
  type,
}) => {
  const colors = useSelector(state => {
    return state.theme.colors;
  });
  return (
    <>
      {!nogradient ? (
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          locations={[-0.01, 0.9999]}
          colors={['#5389C4', '#7F3291']}
          style={[styles.buttonStyle, style]}>
          <TouchableOpacityView
            onPress={onPress}
            style={{
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}>
            <AppText
              style={[styles.color(colors)]}
              type={type ? type : FORTEEN}
              weight={weight ? weight : POPPINS_BOLD}>
              {children}
            </AppText>
          </TouchableOpacityView>
        </LinearGradient>
      ) : (
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#5389C4', '#7F3291']}
          style={[styles.buttonStyle, style]}>
          <TouchableOpacityView
            onPress={onPress}
            style={[
              {
                margin: 1,
                width: '100%',
                height: '100%',
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: backgroundColor ? backgroundColor : 'black',
                style,
              },
            ]}>
            <AppText
              color={color ? color : BLACK}
              type={type ? type : FORTEEN}
              weight={weight ? weight : POPPINS_BOLD}>
              {children}
            </AppText>
          </TouchableOpacityView>
        </LinearGradient>
      )}
    </>
  );
};

export {Button};

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
    borderRadius: 4,
    margin: 5,
    padding: 1,
    width: 100,
  },
  color: colors => ({
    color: colors.white,
  }),
});
