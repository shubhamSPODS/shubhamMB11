// import {StyleSheet} from 'react-native';

// const styles = StyleSheet.create({
//   container: {
//     height: 131,
//     borderRadius: 17,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#4C5199',
//     marginBottom: 10,
//   },
//   topContainer: {
//     height: 131 - 33,
//     backgroundColor: 'rgba(24, 22, 82, 0.5)',
//     padding: 10,
//     justifyContent: 'space-evenly',
//   },
//   top: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   contestName: {
//     color: 'white',
//     fontSize: 10,
//     opacity: 0.5,
//   },
//   entryType: {
//     color: 'white',
//     fontSize: 9,
//     opacity: 0.5,
//   },
//   bedge: {
//     height: 25,
//     width: 56,
//     backgroundColor: '#37CC4C',
//     borderRadius: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   progressBar: {
//     height: 3,
//     backgroundColor: '#D9D9D9',
//     borderRadius: 4,

//     overflow: 'hidden',
//   },
//   bottomContainer: {
//     height: 32,
//     paddingHorizontal: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   gloryIcon: {
//     height: 18,
//     width: 18,
//     resizeMode: 'contain',
//   },
//   commonViewStyle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   commonTextStyle: {
//     color: 'white',
//     fontSize: 10,
//     opacity: 0.5,
//     marginLeft: 6,
//   },
//   flex: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   grayContainer: {
//     height: 18,
//     width: 18,
//     backgroundColor: 'rgba(136, 209, 242, 0.3)',
//     borderRadius: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   teamLabel: {
//     fontSize: 9,
//     color: 'white',
//   },
//   marginRight7: {
//     marginRight: 7,
//   },
// });

// export default styles;
import { StyleSheet } from 'react-native';
import { NewColor, colors } from '../../../theme/color';
import { universalPaddingHorizontal } from '../../../theme/dimens';

const styles = StyleSheet.create({
  container: {
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    borderColor: colors.borderLightBlue,
    backgroundColor: "#343434"
  },
  topContainer: {
    paddingHorizontal: universalPaddingHorizontal,
    justifyContent: 'space-evenly',
    backgroundColor: colors.background
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  entryType: {
    color: 'white',
    fontSize: 9,
    opacity: 0.5,
  },
  bedge: {
    height: 25,
    width: 56,
    backgroundColor: colors.green,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#D9D9D9',
    borderRadius: 4,

    overflow: 'hidden',
  },
  bottomContainer: {
    paddingHorizontal: 10,
    backgroundColor: NewColor.linerBlackFive,
    paddingVertical: 10
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
    color: 'white',
    fontSize: 10,
    opacity: 0.5,
    marginLeft: 6,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grayContainer: {
    height: 18,
    width: 18,
    backgroundColor: "#AD7619",
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  teamLabel: {
    fontSize: 9,
    color: 'white',
  },
  marginRight7: {
    marginRight: 7,
  },
  listdownContainer: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: universalPaddingHorizontal,
    height: 35,
  },
  downArrowList: {
    height: 20, width: 20,
  }
});

export default styles;
