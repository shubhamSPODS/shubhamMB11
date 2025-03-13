import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 170,
  },

  ImgContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  mumbaiIndianContainer: {
    height: 80,
top:10,
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
    top:20
  },
  LogoWithNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName:{
    color:'white',
  },
  teamShortName:{
    fontWeight: '700',
    display: 'flex',
    alignSelf: 'center',
    color:'white',
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

  noOfTeamAndContestContainer: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderColor:"#16406F",
    borderWidth:1,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    marginEnd: 0,
    position: 'absolute',
    bottom: 0,
    width: '95%',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  contextText: {
    marginLeft: 20,
    color:"white"
  },

  flatListMainContainer: {
    flex: 1,
    
  },
  flatListWrapper: {
    height: '100%',
  },
  touchabaleOpacityView: {
    height: '100%',
    width: '100%',
  },
  fastImages: {
    width: '95%',
borderColor:"#16406F",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingBottom: 10,
    height: 170,
    alignSelf:"center",
    borderWidth:1,
    backgroundColor:"#122B47"
  },
  fastImgView: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
    height: 20,
  },

  fastImgStyle: {height: '110%', width:'100%', padding: 0,flexDirection:"column",top:5},
  fastImgText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  LogoWithNameContainerFastImg: {
    height: 45,
    width: 50,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
  opponentFastImg: {
    height: 45,
    width: 50,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
});

export default styles;
