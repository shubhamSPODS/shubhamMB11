import { StyleSheet } from 'react-native';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { fontFamilyPoppins } from '../../theme/typography';
import { colors } from '../../theme/color';

const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  withdraw: {
    marginTop: 10,
  },
  box: {
    borderWidth: 1,
    backgroundColor: colors.bottomBackgroundColor,
    borderRadius: 16,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  label: {
    marginBottom: 10,
    // color:colors.white
  },
  textInputBox: {
    fontFamily: fontFamilyPoppins,
    fontSize: 12,
    color: colors.white
  },
  boxContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    marginTop: 30,
  },
  bankLogo: {
    height: 50, width: 50,
    marginTop: 15
  },
  containeImage: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 10
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: 'rgba(63, 139, 238, 0.3)',
    borderRadius: 8,
    marginTop: 10,
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.4)"
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
  rbContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  openGallary: {
    height: 40,
    width: "48%",
    borderWidth: 1,
    borderColor: 'rgba(63, 139, 238, 0.3)',
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  cameraIconStyle: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
});

export default styles;
