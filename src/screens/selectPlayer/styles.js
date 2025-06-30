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
    height: 45,
    width: 40,
    resizeMode: 'contain',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 6,
    justifyContent: 'center',
    height: '100%',
  },
  playerName: {
    fontSize: 12,
    marginTop: 0,
    textTransform: 'capitalize',
  },
  points: {
    fontSize: 11,
    textAlign: 'center',
  },
  credits: {
    color: 'white',
    fontSize: 12,
  },
  plusIcon: {
    height: 24,
    width: 24,
    marginLeft: 4,
    top: 21,
    left: 6,
  },
  creditBtnView: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 4,
    height: '100%',
    justifyContent: 'center',
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
  },
  playerItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  selectPlayerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderBottomWidth: 0.2,
    borderBottomColor: colors.gray,
    marginBottom: 6,
    borderRadius: 8,
    marginHorizontal: 4,
    height: 85,
  },
  description: {
    color: 'white',
    fontSize: 10,
  },
  splitViewCard: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  roleText: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  teamText: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  teamDivider: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 8,
    marginHorizontal: 16,
    opacity: 0.5,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  teamHeaderText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  playerCountBadge: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  playerCountText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  teamSection: {
    flex: 1,
    backgroundColor: NewColor.linerBlackFive,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    height: 4,
    width: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 9,
  },
});

export default styles;
