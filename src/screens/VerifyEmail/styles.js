import { StyleSheet } from 'react-native';

import { Screen } from '../../theme/dimens';
import { fontFamilyPoppins, poppinsSemiBold } from '../../theme/typography';
import { colors } from '../../theme/color';

const styles = StyleSheet.create({
  bottomContainer: {
    marginHorizontal: 10,
  },
  withdraw: {
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#BEBEBE",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  },
  box: {
    borderWidth: 1,
    backgroundColor: "#3F3F3F",
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 20
  },
  recommended: {
    width: 82,
    height: 19,
    position: "absolute",
    right: -12,
    top: 3
  },
  checkIcon: {
    height: 20,
    width: 20
  },
  inputStyle: {
    fontSize: 13,
    fontFamily: poppinsSemiBold,
    flex: 1,
    color: colors.white
  },
  label: {
    marginTop: 0,
  },
  textInputBox: {
    fontFamily: fontFamilyPoppins,
    fontSize: 12,
  },
  boxContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },

  otp: {
    marginTop: 10,
  },
  buttonStyle: {
    marginHorizontal: 5,
    marginBottom: 5,
    width: 66,
    height: 21
  },
  inputContainerTwo: {
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#BEBEBE",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  },
});

export default styles;
