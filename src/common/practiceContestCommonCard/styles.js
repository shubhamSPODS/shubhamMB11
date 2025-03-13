import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  contestCommonCard: {
    height: 140,
    marginBottom: 10,
    marginTop: 10,
  },
  cardPercentage: {
    height: '100%',
  },
    cardcontainer: {
    // backgroundColor: '#181652',
    height: '100%',
    width: '100%',
    borderRadius: 15,

    borderWidth: 1,
borderColor:"#16406F",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cardInsideView: {
    width: '100%',
    height: '100%',
  },
  cardBottomView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rupeeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  amountText: {color: '#FFFFFF', fontWeight: 'bold'},
  discountText: {
    marginRight: 0,
    position: 'absolute',
    left: 60,
    color: '#FFFFFF',
    fontSize: 10,
  },
  rightSideRupee: {
    height: 20,
    width: 50,
    backgroundColor: '#37CC4C',
    borderRadius: 4,
  },

  rightSideRupeText: {textAlign: 'center', color: '#FFFFFF'},
  progressBarContainer: {marginTop: 30},
  spotContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,

    position: 'absolute',
    top: 65,
    width: '100%',
  },
  cardBottomPartContainer: {
    width: '100%',
    height: '30%',
    backgroundColor: '#000211',

    position: 'absolute',
    bottom: 0,
    borderWidth: 1,
    borderBottomColor: '#172C66',
    borderLeftColor: '#172C66',
    borderRightColor: '#172C66',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 2,
    borderTopLeftRadius: 2,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardBottomWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',

    marginLeft: 0,
  },
  bottomCardInnerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '30%',
  },
  bottomContentWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',

    alignItems: 'center',
  },
  bottomImageBadge: {
    height: '40%',
    width: 20,
  },
  badgeAmountText: {
    fontSize: 8,
    marginLeft: 4,
    fontSize: 12,
  },
  cupContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',

    alignItems: 'center',

    marginLeft: 4,
  },
  cupImage: {
    height: '40%',
    width: 20,

    marginLeft: 4,
  },
  cupPercentage: {
    fontSize: 8,
    marginLeft: 4,
    fontSize: 12,
  },
  ellipseContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',

    alignItems: 'center',
    width: '100%',
  },
  ellipseImage: {
    height: '40%',
    width: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  dollarImg: {
    height: '60%',
    width: 20,
  },
  playText: {
    fontSize: 8,
    marginLeft: 4,
    fontSize: 12,
  },
  checkMarkContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',

    alignItems: 'center',
  },
  checkMark: {
    height: '60%',
    width: 20,
  },
  guarenteeText: {
    fontSize: 8,
    marginLeft: 4,
    color: '#FFFFFF',
    fontSize: 12,
  },
  prizePool: {color: '#FFFFFF', fontSize: 10},
  multipleText: {color: '#FFFFFF', fontSize: 10},
});

export default styles;