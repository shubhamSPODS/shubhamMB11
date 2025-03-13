import { Dimensions, StyleSheet } from 'react-native';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { NewColor, colors } from '../../theme/color';

const styles = StyleSheet.create({
  top: {
    height: 190,
    width: Dimensions.get('window').width,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 35,
    height: 52,
    marginTop: 10
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: universalPaddingHorizontal,
    width: '100%',
    marginTop: '12%',
  },
  leftArrow: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
    marginRight: 10
  },
  text: {
    color: 'white',
    marginLeft: Dimensions.get('window').width / 2.8,
  },
  alignSelfCenter: {
    left: 10,
  },
  matchCard: {
    resizeMode: 'contain',
  },
  card: {
    height: 90,
    width: '100%',
    overflow: 'hidden',
    marginTop: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  teamNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 10,
  },
  teamName: {
    color: 'white',
    opacity: 0.9,
  },
  teamLogo: {
    height: 45,
    width: 45,
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
    paddingVertical: 20,
    paddingHorizontal: universalPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabContainer: {
    height: 42,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '98%',
    borderRadius: 20,
  },
  playerListingHead: {
    height: 40,
    backgroundColor: NewColor.linerBlackFive,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    width: '100%',
    borderBottomWidth: 0.2,
    borderBottomColor: colors.gray,
    marginTop: -7
  },
  playerListingHeadTitle: {
    color: 'white',
    fontSize: 9,
    opacity: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 60,
    marginVertical: 10,
  },
  btn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  createContest: {
    borderWidth: 1,
    borderColor: '#4F7ABA',
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
  },
  playerImage: {
    height: 65,
    width: 53,
  },
  playerName: {
    marginTop: 10,
    textTransform: 'capitalize',
    
  },
  selectPlayerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: colors.gray,
    marginBottom: 10,
    borderRadius: 10
  },
  description: {
    color: 'white',
    fontSize: 10,
  },
  points: {
    textAlign: 'center',
  },
  credits: {
    color: 'white',
    fontSize: 12,
  },
  plusIcon: {
    height: 34,
    width: 34,
    position: "absolute",
    right: -11,
    bottom: -27
  },
  creditBtnView: {
    flexDirection: 'row',
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    backgroundColor: colors.borderBackColor,
    width: "12%",
    marginLeft: "5%",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  tabbar: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderBottomWidth: 0,
  }
});

export default styles;
