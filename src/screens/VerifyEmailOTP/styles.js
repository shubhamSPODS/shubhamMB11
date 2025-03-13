import {StyleSheet} from 'react-native';

import {Screen, universalPaddingHorizontal} from '../../theme/dimens';
import {colors} from '../../theme/color';
import {fontFamilyPoppins} from '../../theme/typography';

const styles = StyleSheet.create({
  bottomContainer: {
    marginHorizontal: universalPaddingHorizontal,
  },
  withdraw: {
    marginTop: 20,
  },
  otp: {
    marginTop: 0,
    alignSelf: 'center',
    marginBottom: 5,
  },

  box: {
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    borderRadius: 16,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  textInputBox: {
    height: 45,
    width: 330,
  },
  boxContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },

  underlineStyleBase: {
    width: 40,
    height: 40,
    // borderWidth: 0,
    borderBottomWidth: 1,
    alignSelf: 'center',
    borderRadius: 4,
    borderColor: colors.borderLightBlue,
    color: colors.linerLineBlue,
    fontSize: 15,
  },

  underlineStyleHighLighted: {
    borderColor: colors.linerLineBlue,
  },
  account: {
    alignSelf: 'center',
    marginTop: 15,
  },

});

export default styles;
