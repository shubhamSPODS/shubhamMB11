import React from 'react';
import {View} from 'react-native';
import {AppText, BLACK, FORTEEN, POPPINS_MEDIUM, SIXTEEN, WHITE} from '../AppText';
import {useSelector} from 'react-redux';

import {LeftArrowIcon, arrow, logo} from '../../helper/image';
import styles from './styles';
import {RootState} from '../../libs/rootReducer';
import NavigationService from '../../navigation/NavigationService';
import {TouchableOpacityView} from '../TouchableOpacityView';
import FastImage from 'react-native-fast-image';
import {salPaddingHorizontal} from '../../theme/dimens';
import {colors} from '../../theme/color';

const Header = props => {
  const {commonHeader, title, color, tintColor} = props;

  return (
    <>
      {commonHeader ? (
        <View style={[styles.header, props.style]}>
          <TouchableOpacityView
          style={styles.arrowview}
            onPress={() => {
              NavigationService.goBack();
            }}>
            <FastImage
              style={styles.arrowIcon}
              resizeMode="contain"
              source={LeftArrowIcon}
              // tintColor={tintColor ? tintColor : colors.white}
            />
          </TouchableOpacityView>

          <AppText
            color={color ? color : WHITE}
            type={SIXTEEN}
            weight={POPPINS_MEDIUM}
            style={styles.title}>
            {title}
          </AppText>
        </View>
      ) : (
        <>
          <TouchableOpacityView
            style={styles.bottomContainer}
            onPress={() => {
              NavigationService.goBack();
            }}>
            <FastImage
              style={styles.arrow}
              resizeMode="contain"
              source={arrow}
            />
          </TouchableOpacityView>
          <FastImage resizeMode="contain" style={styles.logo} source={logo} />
        </>
      )}
    </>
  );
};

export default Header;
