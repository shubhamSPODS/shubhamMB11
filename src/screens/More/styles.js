import { StyleSheet } from 'react-native';

import {
  Battle_Infinity,
  Logo,
  Screen,
  universalPaddingHorizontal,
} from '../../theme/dimens';
import { NewColor, colors } from '../../theme/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },

  box: {
    borderWidth: 1,
    // borderColor: colors.borderLightBlue,
    borderRadius: 16,
    marginTop: 10,
    backgroundColor:colors.bottomBackgroundColor
  },
  phoneContainer: {
    height: 45,
    width: 45,
    marginHorizontal: 3,
    marginVertical: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NewColor.linerLightBlueTwinty,
  },
  mobile: {
    marginLeft: 10,
  },
  //   topContainer: {
  //     flexDirection: 'row',
  //     justifyContent: 'space-between',
  //   },
  title: {
    color: 'white',
    alignSelf: 'center',
    marginTop: Screen.Height / 2.2,
  },
  rightArrow: {
    width: 6,
    height: 12,
  },
  mobileContainer: {
    alignSelf: 'center',
  },

  logo: {
    height: Battle_Infinity.Height,
    width: Battle_Infinity.Width,
    flex: 1,
  },
  register: {
    color: 'white',
    alignSelf: 'center',
    marginTop: 10,
  },
  referral: {
    color: 'white',
  },

  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  button: {
    marginTop: 20,
    marginBottom: 20
  },
  bottom: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bell: {
    height: 24,
    width: 23,
    // marginLeft: 'auto',
  },
  topContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    height: 20,
    width: 20,
  },
  arrow: {
    alignSelf: 'center',
    marginRight: 10,
  },
  modalText: {
    textAlign: 'center',
    color: 'white',
  },
  logout: {
    // width: 250,
  },
  cancel: {
    //  width: 250,
  },
  modalBox: {
    height: 240,
    width: '100%',
    padding: 30,
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
});

export default styles;
