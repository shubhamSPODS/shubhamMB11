import {StyleSheet} from 'react-native';

import {Screen, universalPaddingHorizontal} from '../../theme/dimens';
import {NewColor, colors} from '../../theme/color';

const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  cardContainer: {
    flexDirection: 'row',
  },
  add: {
    padding: 15,
  },

  box: {
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    borderRadius: 16,
    marginTop: 10,
  },
  textInputBox: {
    height: 45,
    width: 330,
  },
  delete: {
    height: 16,
    width: 16,
    alignSelf: 'center',
    marginRight: 10,
  },
  deleteContainer: {
    alignSelf: 'center',
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
  mobile: {
    marginLeft: 10,
  },
  mobile2: {
    marginLeft: 10,
  },
  topContainers: {
    flexDirection: 'row',
  },
  bottomBox: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  getVerified: {
    marginTop: 20,
  },
  card: {
    height: 20,
    width: 20,
  },
  phoneContainer: {
    backgroundColor: NewColor.linerLightBlueTwinty,
    height: 45,
    width: 45,
    marginHorizontal: 3,
    marginVertical: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileContainer: {
    alignSelf: 'center',
  },
  options: {
    marginTop: 20,
  },
  link: {
    alignSelf: 'center',
    marginRight: 10,
  },
  modalBox: {
    height: 240,
    width: '95%',
    padding: 30,
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  modalText: {
    textAlign: 'center',
  },
});

export default styles;
