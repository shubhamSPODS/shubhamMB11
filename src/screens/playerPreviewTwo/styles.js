import { Dimensions, StyleSheet } from 'react-native';
import { NewColor, colors } from '../../theme/color';
import { universalPaddingHorizontal } from '../../theme/dimens';

const styles = StyleSheet.create({
  card: {
    height: 120,
    width: Dimensions.get('window').width,
    paddingTop: 10,
    paddingHorizontal: universalPaddingHorizontal,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: universalPaddingHorizontal,
    marginTop: '10%'
  },
  subsituteIcon: {
    height: 13,
    width: 13,
    marginTop: -3,
    marginRight: 5
  },
  leftArrow: {
    height: 16,
    width: 16,
  },
  timeLeft: {
    color: 'white',
  },
  text: {
    fontSize: 10,
    fontWeight: '400',
    color: 'white',
    textAlign: 'left',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  teamNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 20,
    // padding: 5,
    // paddingBottom: 10,
  },
  teamName: {
    color: 'white',
    opacity: 0.9,
  },
  teamLogo: {
    height: 40,
    width: 40,
  },
  midContainer: {
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorWhite: {
    color: 'white',
  },
  bottomContainer: {
    padding: 15,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondImage: {
    flex: 1,
  },
  groundContainer: {
    flex: 1,

  },
  playerImage: {
    height: 53,
    width: 45,
  },
  singlePlayerContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  playerName: {
    padding: 2,
    paddingHorizontal: 5,
    borderRadius: 2,
  },
  playerContainer: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 10
  },
  title: {
    textAlign: 'center',
    marginTop: 0,
  },
  title2: {
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    paddingHorizontal: 10,
    // backgroundColor: 'black',
    height: 60,
    marginTop: 5
  },
  btn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: NewColor.linerWhite,
  },
  btn2: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  createContest: {
    borderWidth: 1,
    borderColor: NewColor.linerWhite,
  },
  upIcon: {
    height: 15,
    width: 15,
    position: "absolute",
    right: 0
  }
});

export default styles;
