import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {
  AppText,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_BOLD_ITALIC,
  SIXTEEN,
} from '../AppText';
import {RootState} from '../../libs/rootReducer';
import {TouchableOpacityView} from '../TouchableOpacityView';

const SmallButton = ({
  children,
  title,
  buttonStyle,
  onPress,
  activeOpacity,
  containerStyle,
  titleStyle,
  disabled,

  isSecond,
  ...rest
}: BProps) => {
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  return (
    <TouchableOpacityView style={buttonStyle} onPress={onPress}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#003E9B', '#AD53CC', '#4F7ABA', '#E18FFF']}
        style={styles.linearGradient}>
        <AppText
          type={SIXTEEN}
          weight={POPPINS_BOLD_ITALIC}
          style={styles.buttonText(colors)}>
          {title}
        </AppText>
      </LinearGradient>
    </TouchableOpacityView>
  );
};

export default SmallButton;
