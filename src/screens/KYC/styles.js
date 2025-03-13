import { Dimensions, StyleSheet } from 'react-native';

import { Screen, universalPaddingHorizontal } from '../../theme/dimens';
import { fontFamilyPoppins } from '../../theme/typography';
import { NewColor, colors } from '../../theme/color';

const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  checkIcon: {
    height: 20,
    width: 20
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
  buttonTwo: {
    marginTop: 30,
    marginBottom: 20
  },
  box: {
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    borderRadius: 16,
    marginTop: 10,
    // padding: 2,
  },
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
  mobile: {
    marginLeft: 10,
  },
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
  getVerified: {
    marginTop: 20,
    marginBottom:10
  },
  phone: {
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
    // alignSelf: 'center',
  },
  mobileContainer: {
    alignSelf: 'center',
    flex: 1,
    // backgroundColor: 'red',
  },
  verified: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 2
  },

  editButton: { width: 70, alignSelf: 'center', marginHorizontal: 10 },
  editButtonTitle: {
    fontSize: 12,
    fontFamily: fontFamilyPoppins,
    color: colors.black
  },
  otherMethodContainer: {
    flexDirection: "row",
    alignItems: 'center',
    alignSelf: "flex-end",
    marginTop: 10,
  },
  downArrwoStyle: {
    height: 25,
    width: 25,
    transform: [{ rotate: '180deg' }]
  },
  otherContainer: {
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NewColor.linerBlacklight,
  },
  modalContainer: {
    width: Dimensions.get('window').width - 20,
    // height: 243,
    backgroundColor: NewColor.linerWhite,
    borderRadius: 16,
    overflow: 'hidden',
    // justifyContent: 'space-between',
    paddingBottom: 20,
  },
  modalTopSection: {
    height: 54,
    backgroundColor: NewColor.linerBlackFive,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  kycLogoS: {
    width: 223,
    height: 222,
    alignSelf: 'center',
    marginTop: 20
  },
  headerText: {
    textAlign: "center"
  },
  panContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#002E612B',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 46
  },
  buttonStyle: {
    marginHorizontal: 5,
    width: 66,
    height: 21
  },
  renderImage: {
    height: 20,
    width: 20,
    marginRight: 10
  },
  underContainer: {
    flexDirection: "row",
    alignItems: "center"
},
renderContainer: {
  borderWidth: 1,
  borderColor: "#002E6117",
  paddingHorizontal: 10,
  height: 46,
  marginBottom: 10,
  borderRadius: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between"
},
tickContainer: {
  borderRadius: 50,
  borderWidth: 2,
  borderColor: colors.borderBackColor,
  height: 20,
  width: 20,
  alignItems: "center",
  justifyContent: 'center'
},
tick: {
  height: 10,
  width: 10,
  backgroundColor: colors.backGroundBlue,
  borderRadius: 50
},
renderImage: {
  height: 20,
  width: 20,
  marginRight: 10
}
});

export default styles;
