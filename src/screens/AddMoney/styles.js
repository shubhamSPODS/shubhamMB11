import { Platform, StyleSheet } from 'react-native';

import { Screen, universalPaddingHorizontal } from '../../theme/dimens';
import { colors } from '../../theme/color';
import { poppinsSemiBold } from '../../theme/typography';

const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
    flex: 1
  },
  box: {
    // borderWidth: 2,
    // borderColor: colors.borderLightBlue,
    backgroundColor: colors.bottomBackgroundColor,
    borderRadius: 16,
    marginTop: 20,
    padding: 15,
  },
  textInputBox: {
    height: 40,
    color: colors.white

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

  entry: {
    marginTop: 10,
  },
  topContainers: {
    flexDirection: 'row',
  },
  horizontalLine: {
    height: 3,
    width: '100%',
    marginHorizontal: 15,
    marginTop: 10,
  },
  bottomBox: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  phone: {
    height: 18,
    width: 18,
    alignSelf: 'center',
    top: 10,
  },
  mobileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  middleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  smallBtn: {
    width: 70,
    height: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  rsContainer: {
    alignSelf: 'center',
    borderRadius: 4,
    borderColor: "#BEBEBE",
    borderWidth: 1,
  },
  rs: {
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 70,
    height: Platform.OS == 'ios' ? 20 : 30,
    marginTop: Platform.OS == 'ios' ? 5 : 0
  },
  text: {
    color: colors.white
  },
  voucherConatiner: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    marginBottom: -10
  },
  bottomRbContainer: {
    paddingVertical: 10
  },
  innerContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingHorizontal: universalPaddingHorizontal,

  },
  buttonApply: {
    backgroundColor: colors.green,
    borderRadius: 8,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4
  },
  textStyle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: poppinsSemiBold,
    flex: 1,
    color:colors.white
  },
  inputContainer: {
    paddingHorizontal: universalPaddingHorizontal,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginHorizontal: universalPaddingHorizontal,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor:colors.lightWhite
  }
});

export default styles;
