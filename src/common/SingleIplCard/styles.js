// import {StyleSheet} from 'react-native';

// const styles = StyleSheet.create({
//   wrapperContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//     padding: 0,
//   },
//   backgroundImageContainer: {
//     height: 160,

//     width: '100%',
//     backgroundColor: 'transparent',
//     padding: 0,
//     position: 'relative',
//   },
//   bgImage: {
//     height: '100%',

//     width: '100%',
//   },
//   swipperContainer: {
//     height: 130, //checkkkkkkkkkkkkkkkkkkkk
//     width: '100%',
//     position: 'absolute',
//     top: -60,

//   },

//   btnStyle: {
//     width: 170,
//   },

//   gradientButtonContainer: {
//     flex: 0.7,
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 3,
//     paddingVertical: 3,
//     margin: 10,
//     bottom:60,
//     backgroundColor:"black"
//   },
//   eachGradientButton: {
//     height: '100%',
//     width: '32.33%',
//     backgroundColor: 'black',
//     marginRight: '1%',
//     marginLeft: 0,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     borderWidth: 0,
//   },
//   insideButtonGradientStyle: {
//     height: '100%',
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   myContestTextContainer: {
//     height: '100%',
//     width: '32.33%',
//     marginRight: '1%',
//     borderRadius: 30,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   myText: {textAlign: 'center',color:"#ffffff"},
//   myTeamTextContainer: {
//     height: '100%',
//     width: '32.33%',
   

//     marginRight: '1%',
//     padding: 4,
//     borderRadius: 30,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   megaContestFlexContainer: {
//     flex: 4,
//     padding: 10,
//     bottom:50
//   },
//   linearGradient: {
//     borderRadius: 10,
//     height: 45,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width:350,
//     alignSelf:"center"
//   },
//   buttonText: colors => ({
//     color: colors.white,
//     fontWeight:"700"
//   }),
//   megaContestText: {color: 'white', fontWeight: 'bold', fontSize: 15},
//   practiceContestContainer: {
//     flex: 4,
//     padding: 10,
//   },
//   practiceContestText: {
//     marginTop: 0,
//     position: 'absolute',
//     top: 0,
//     // left: 10,
//     marginBottom: 50,
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   practiceSliderContainer: {
//     paddingTop: 10,
//   },
//   contestButtonContainer: {
//     marginTop: 5,
//     paddingVertical: 3,
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent:'space-evenly',
//     alignItems: 'center',
//     width: '95%',
//     alignSelf:"center",
//     bottom:10
//   },
//   buttonWrapperContainer: {
//     height: 20,
//     width: '50%',
//     display: 'flex',
//     alignSelf: 'flex-end',
//   },
//   insideButtonWrapper: {
//     height: 30,
//     marginBottom: 10,
//     display: 'flex',
//     alignSelf: 'flex-end',
//     width: '50%',
//   },
//   contestCommonCradContainer: {
//     paddingBottom: 10,
//   },
//   practiceTextFlexContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     paddingBottom: 15,
//   },
//   viewAllView: {
//     height: 30,
//     width: 70,
//     borderWidth: 0.5,
//     borderColor: '#88D1F2',

//     borderRadius: 25,
//     position: 'absolute',
//     right: 0,
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   viewAllText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//     display: 'flex',
//     flexDirection: 'row',

//     textAlign: 'center',
//     justifyContent: 'center',
//   },

//   forwardIcon: {
//     height: 10,
//     width: 15,
//   },
// });

// export default styles;
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    backgroundColor: 'black',
    padding: 0,
  },
  backgroundImageContainer: {
    height: 160,

    width: '100%',
    backgroundColor: 'transparent',
    padding: 0,
    position: 'relative',
  },
  bgImage: {
    height: '100%',

    width: '100%',
  },
  swipperContainer: {
    height: 130, //checkkkkkkkkkkkkkkkkkkkk
    width: '100%',
    position: 'absolute',
    top: -60,
  },

  btnStyle: {
    width: 170,
  },

  gradientButtonContainer: {
    marginTop: 80,
    flex: 0.7,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 30,
    margin: 10,
    borderColor: '#5588c3',
    borderWidth: 2,
  },
  eachGradientButton: {
    height: '100%',
    width: '32.33%',
    backgroundColor: '#A67CFF',
    marginRight: '1%',
    marginLeft: 0,
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: '#00B4C3',
  },
  insideButtonGradientStyle: {
    height: '100%',
    width: '100%',

    borderRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  myContestTextContainer: {
    height: '100%',
    width: '32.33%',
    backgroundColor: '#172c66',
    marginRight: '1%',
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  myText: {textAlign: 'center'},
  myTeamTextContainer: {
    height: '100%',
    width: '32.33%',
    backgroundColor: '#172c66',

    marginRight: '1%',
    padding: 4,
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  megaContestFlexContainer: {
    flex: 4,
    padding: 10,
  },
  megaContestText: {color: 'white', fontWeight: 'bold', fontSize: 15},
  practiceContestContainer: {
    flex: 4,
    padding: 10,
  },
  practiceContestText: {
    marginTop: 0,
    position: 'absolute',
    top: 0,
    // left: 10,
    marginBottom: 50,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  practiceSliderContainer: {
    paddingTop: 10,
  },
  contestButtonContainer: {
    marginTop: 5,

    paddingVertical: 3,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  buttonWrapperContainer: {
    height: 20,

    width: '50%',
    display: 'flex',
    alignSelf: 'flex-end',
  },
  insideButtonWrapper: {
    height: 30,
    marginBottom: 10,
    display: 'flex',
    alignSelf: 'flex-end',
    width: '50%',
  },
  contestCommonCradContainer: {
    paddingBottom: 10,
  },
  practiceTextFlexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 15,
  },
  viewAllView: {
    height: 30,
    width: 70,
    borderWidth: 0.5,
    borderColor: '#88D1F2',

    borderRadius: 25,
    position: 'absolute',
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewAllText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',

    textAlign: 'center',
    justifyContent: 'center',
  },

  forwardIcon: {
    height: 10,
    width: 15,
  },
});

export default styles;

