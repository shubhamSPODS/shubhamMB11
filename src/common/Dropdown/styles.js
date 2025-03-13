import { StyleSheet } from 'react-native';
import { Primary } from '../../theme/dimens';
import { fontFamilyPoppins } from '../../theme/typography';
import { colors } from '../../theme/color';

const styles = StyleSheet.create({
  background: {
    height: Primary.Height,
    borderRadius: 5,
    borderColor: colors.borderLightBlue,
    backgroundColor: '#606060',
  },
  placeholderText: {
    fontFamily: fontFamilyPoppins,
    fontSize: 12,
    color: colors.white
  },
  dropDownContainerStyle: {
    borderColor: colors.borderLightBlue,
  },
  textStyle: {
    color: colors.black,
  },
  NameLabel: {
    marginTop: 20,
    marginBottom: 5,
  },
  arrowIcon: {
    tintColor: colors.white,
  }

});

export default styles;
