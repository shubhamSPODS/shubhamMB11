import React from 'react';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {
  AppText,
  POPPINS_EXTRA_BOLD_ITALIC,
  SIXTEEN,
  POPPINS_BOLD,
  WHITE,
} from '../AppText';
import { RootState } from '../../libs/rootReducer';
import { TouchableOpacityView } from '../TouchableOpacityView';
import { colors } from '../../theme/color';

const PrimaryButton = ({
  title,
  buttonStyle,
  onPress,
  smallBtn,
  titleStyle,
  type,
  ...rest
}: any) => {
  return (
    <TouchableOpacityView
      activeOpacity={0.1}
      {...rest}
      style={buttonStyle}
      onPress={onPress}>
      <LinearGradient
        colors={[colors.playerDetailsLinerOne, colors.playerDetailsLinerTwo]}
        start={{x: 0, y: 0}}
        end={{x: 1.0, y: 0}}
        style={[styles.linearGradient, smallBtn]}>
        <AppText
          type={type ? type : SIXTEEN}
          weight={POPPINS_BOLD}
          style={[styles.buttonText, titleStyle]}>
          {title}
        </AppText>
      </LinearGradient>
    </TouchableOpacityView>
  );
};

export default PrimaryButton;
