import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    flexGrow: 1,
    height: '100%',
  },
  wrapperContainer: {
    flex: 1,
    display: 'flex',
  },
  firstContainer: {
    height: '30%',
    flex: 1,
  },

  headerPart: {
    height: '60%',
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    padding: 10,
    // important padding -10 to all
  },

  cricketFootballContainer: {
    marginTop: 30,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myMatchAndViewAllContainer: {
    marginTop: 35,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  myMatch: {
    fontWeight: 600,
  },
  viewAllContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#071863',
  },
  forwardIcon: {
    height: 12,
    marginLeft: 5,
    width: 5,
  },

  // swipper

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    backgroundColor: 'green',
  },
  dotsWrapperStyle: {
    position: 'absolute',
  },
  sliderMainContainer: {
    flex: 1,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',

    padding: 10,
  },
  ImgContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mumbaiIndianContainer: {
    height: 80,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textLogoImgContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  LogoWithNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {},
  teamShortName: {
    fontWeight: '700',
    display: 'flex',
    alignSelf: 'center',
  },
  IPLTextContainer: {
    display: 'flex',

    justifyContent: 'center',
  },
  IPlDivContainer: {
    height: 20,
    width: 50,
  },
  iplText: {
    position: 'absolute',
    top: 0,
    bottom: 60,
  },

  live: {
    color: '#15CE31',
    display: 'flex',

    marginLeft: 14,
  },
  LogoWithNameContainerReverse: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom part
  noOfTeamAndContestContainer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    marginEnd: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#162123',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  contextText: {
    marginLeft: 20,
  },
  modelTextContainer: {
    display: 'flex',

    justifyContent: 'center',
    backgroundColor: '#1e2f68',
    padding: 20,
  },
  modalText: {fontSize: 15, padding: 10},
  modelCloseButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  CrossIcon: {
    height: 15,
    width: 15,
    position: 'absolute',
    right: 0,
    top: 14,
    right: 10,
  },
  fastImageContainer: {
    height: 15,
    width: 15,
    position: 'absolute',
    right: 0,
    top: 0,
    right: 10,
  },
  grabText: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontStyle: 'italic',
    color: 'white',
  },

  swipperContainer: {
    // backgroundColor: 'red',
    height: 170,
    width: '100%',
    position: 'absolute',
    top: 140,
    borderRadius: 30,
    padding: 10,
  },
  upcomingAndFlatListContainer: {
    backgroundColor: 'black',
    flex: 1,
    padding: 10,
  },
  upComingText: {
    fontWeight: '900',
    fontSize: 14,
    color: 'white',
    marginBottom: 15,
  },

  flatSliderContainer: {
    marginBottom: 10,
    flex: 1,
  },
  mainModal: {
    // color: 'blue',
    // flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'blue',

    padding: 30,
    height: 40,
    width: 70,
  },
  modeColumContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalBgContainer: {
    color: 'black',
    flex: 1,

    position: 'absolute',
    top: 250,
    bottom: 150,

    backgroundColor: '#1e2f68',
    width: '90%',

    height: '40%',
    borderRadius: 20,
    fontWeight: 900,
    fontSize: 40,
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  modelWrapperContainer: {
    backgroundColor: '#121c3a',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
  },

  containerMain: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default styles;
