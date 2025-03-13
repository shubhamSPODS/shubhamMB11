import {StyleSheet} from 'react-native';

import {Screen} from '../../theme/dimens';

const styles = StyleSheet.create({
  bottomContainer: {
    marginHorizontal: 20,
  },
  withdraw: colors => ({
    color: colors.white,
    marginTop: Screen.Height / 24,
  }),
  topText: colors => ({
    color: colors.white,
    marginTop: 15,
    marginHorizontal: 10,
  }),

  box: colors => ({
    borderWidth: 2,
    borderColor: colors.dot,
    borderRadius: 16,
    marginTop: 10,
  }),
  textInputBox: {
    height: 45,
    width: 330,
  },
  boxContainer: {
    // marginHorizontal: 10,
    // marginBottom: 20,
  },
  button: {
    marginTop: Screen.Height / 3,
  },
  scan: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: Screen.Height / 14,
  },
  copy: {
    width: 54,
    height: 48,
    alignSelf: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  code: {
    alignSelf: 'center',
  },
  mobile: colors => ({
    color: colors.white,
    marginLeft: 10,
  }),
  topContainers: {
    flexDirection: 'row',
  },
  bottomBox: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  discription: colors => ({
    color: colors.white,
    marginTop: 10,
  }),
  getVerified: colors => ({
    color: colors.white,
    marginTop: 25,
  }),
  phone: {
    height: 18,
    width: 18,
    alignSelf: 'center',
    top: 10,
  },
  phoneContainer: colors => ({
    backgroundColor: colors.white,
    height: 42,
    width: 42,
    marginHorizontal: 3,
    marginVertical: 3,
    borderRadius: 13,
    alignSelf: 'center',
  }),
  mobileContainer: {
    alignSelf: 'center',
  },
  verified: colors => ({
    color: colors.green,
    alignSelf: 'center',
    backgroundColor: colors.verified,
    marginLeft: 13,
    paddingVertical: 2,
    paddingHorizontal: 4,
  }),
  verify: colors => ({
    color: colors.white,
    alignSelf: 'center',
    backgroundColor: colors.verified,
    paddingHorizontal: 10,
    borderRadius: 4,
    paddingVertical: 4,
    marginHorizontal: 10,
  }),
});

export default styles;