import {StyleSheet} from 'react-native';

const cardStyles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    // backgroundColor: 'red',
    flexWrap: 'wrap',
    marginLeft: 4,
    flex: 1,
  },
  eachCard: {
    borderWidth: 2,
    margin: 2,
    marginBottom: 4,

    borderColor: '#172C66',
    borderRadius: 10,
  },
  descContainer: {
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    // height: 70,
    // backgroundColor: 'blue',
    padding: 6,
  },
  titleAmount: {
    // backgroundColor: 'red',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  horizontalImg: {
    // height: 8,
    marginVertical: 15,
    display: 'flex',
    alignItems: 'center',
  },
  horizontalLine: {
    height: 2,
  },
  commissionContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 4,
    // backgroundColor: 'green',
  },
  percentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  daysLeft: {
    color: '#98A2FF',
    fontWeight: 300,
    marginTop: 5,
  },
  amount: {
    fontSize: 15,
  },
  commissionText: {
    fontSize: 15,
  },
  owner: {
    fontSize: 10,
  },
  ownerPercent: {
    fontSize: 15,
  },
  leftSide: {},
  rightSide: {},

  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
    backgroundColor: '#172C66',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default cardStyles;
