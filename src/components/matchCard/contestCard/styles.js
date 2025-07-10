import { StyleSheet } from 'react-native';
import { NewColor, colors } from '../../../theme/color';

const styles = StyleSheet.create({
  container: {
    height: 131,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: colors.background,
    marginBottom: 10,
    backgroundColor:"#343434"
  },
  topContainer: {
    height: 131 - 33,
    padding: 10,
    justifyContent: 'space-evenly',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  entryType: {
    color: 'white',
    fontSize: 9,
    opacity: 0.5,
  },
  bedge: {
    height: 25,
    width: 60,
    backgroundColor: colors.buttoncolor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.lightgry,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bottomContainer: {
    height: 32,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bottomBackgroundColor,
  },
  gloryIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  commonViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  commonTextStyle: {
    marginLeft: 6,
    marginTop: 2,
    fontWeight: "700"
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default styles;

