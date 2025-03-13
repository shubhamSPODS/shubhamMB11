import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
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
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,

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

  bottomPartOfCard: {
    marginTop: 10,
  },
  contextText: {
    marginLeft: 20,
    marginTop: 10,
  },

  fastImgSlider: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  sliderViewContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

    padding: 0,
    height: 20,
  },
  fastImage: {
    height: '100%',
    width: 90,
    padding: 0,
  },

  iplText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loginWithNameContainerFastImg: {
    height: 45,
    width: 50,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
  loginWithNameContainerReverse: {
    height: 45,
    width: 50,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
});

export default styles;
