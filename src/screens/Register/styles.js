import {StyleSheet} from 'react-native';

import {Screen, universalPaddingHorizontal} from '../../theme/dimens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  referral: colors => ({
    color: colors.white,
    marginTop: Screen.Height / 10,
  }),
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  enter: colors => ({
    color: colors.white,
    marginTop: 10,
  }),
  label: {
    marginTop: 50,
  },
  button: {
    marginVertical: 20,
  },
  account: colors => ({
    color: colors.white,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  }),
  register: colors => ({
    color: colors.code,
  }),
  forgot: colors => ({
    color: colors.white,
    alignSelf: 'flex-end',
    marginTop: 13,
  }),
  inputContainer: {
    marginTop: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  policy: colors => ({
    color: colors.white,
    marginStart: 10,
    flex: 1,
  }),
});

export default styles;
