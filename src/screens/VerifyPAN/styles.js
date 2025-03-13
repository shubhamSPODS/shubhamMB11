import {StyleSheet} from 'react-native';

import {Screen, universalPaddingHorizontal} from '../../theme/dimens';
import {fontFamilyPoppins, poppinsSemiBold} from '../../theme/typography';
import {colors} from '../../theme/color';

const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  withdraw: {
    marginTop: 10,
  },
  wallet: colors => ({
    color: colors.code,
    marginTop: 15,
  }),

  box: {
    borderWidth: 1,
    borderColor: "#002E610F",
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 20
  },
  label: {
    marginTop: 0,
    marginBottom: 5,
  },
  textInputBox: {
    fontFamily: fontFamilyPoppins,
    fontSize: 12,
  },
  boxContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    marginTop: 30,
    marginBottom:10
  },
  upload: {
    marginTop: 10,
  },
  image: {
    height: 34,
    width: 34,
    alignSelf: 'center',
    marginTop: 50,
  },
  image2: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    borderRadius: 16,
    marginTop: 10,
    height: 150,
  },
  gallaryContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#002E612B",
    marginTop: 20
  },
  uploadBox: {
    borderRadius: 10,
    width: 199,
    height: 125,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#002E610F",
    borderWidth: 1,
alignSelf:"center"
  },
  adhaarIcon: {
    width: 179,
    height: 105,
    borderRadius: 10
  },
  openGallaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#002E610F",
    height: 40,
    marginTop: 15
  },
  cameraIconStyle: {
    height: 20,
    width: 20,
    marginRight: 10
  },
  recommended: {
    width: 82,
    height: 19,
    position: "absolute",
    right: -12,
    top: 3
  },
  inputContainer: {
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#002E6112",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  },
  checkIcon: {
    height: 20,
    width: 20
  },
  inputStyle: {
    fontSize: 13,
    fontFamily: poppinsSemiBold,
    flex: 1,
    color:colors.black
  },
});

export default styles;
