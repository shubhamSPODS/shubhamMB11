import { View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { AppText, POPPINS_EXTRA_BOLD_ITALIC, SIXTEEN, POPPINS_BOLD, FORTEEN, FIFTEEN, BROWNYELLOW, WHITE } from '../AppText';
import { RootState } from '../../libs/rootReducer';
import { TouchableOpacityView } from '../TouchableOpacityView';

const SecondaryButton = ({
  buttonStyle,
  title,
  onPress,
  btnStyle,
  smallBtn,
  titleStyle,
  buttonViewStyle,
  ...rest
}: any) => {
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  return (
    <TouchableOpacityView
      {...rest}
      style={buttonStyle}
      activeOpacity={1}
      onPress={onPress}>
      <LinearGradient colors={[
        "#252431",
        "#252431"
      ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.0, y: 0 }}
        style={[styles.buttonContainer, buttonViewStyle]}>
        <AppText
          color={WHITE}
          type={FIFTEEN}
          weight={POPPINS_BOLD}
          style={[styles.buttonText, titleStyle]}>
          {title}
        </AppText>
      </LinearGradient >
    </TouchableOpacityView >
  );
};

export default SecondaryButton;
