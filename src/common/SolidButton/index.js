import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
// import {buttonHeight, universalPaddingHorizontal} from '../themes/dimensions';

import {AppText} from '../AppText';
import {useSelector} from 'react-redux';

const SolidButton = ({
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
  ...props
}) => {
  // const colors = useSelector(state => state.theme.colors);
  return (
    <>
      <TouchableOpacity
        style={[
          styles.buttonStyle,
          {backgroundColor: backgroundColor ? backgroundColor : 'black'},
          style,
        ]}
        activeOpacity={!activeOpacity ? activeOpacity : 1}
        onPress={disabled ? console.log('hey') : onPress}>
        <Image source={props.Icon} style={props.ImageStyle} />
        <AppText type={size} weight={weight}>
          {children}
        </AppText>
      </TouchableOpacity>
    </>
  );
};

export {SolidButton};

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  // color: colors => ({
  //   color: colors.white,
  // }),
});
