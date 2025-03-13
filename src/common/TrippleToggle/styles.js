import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'red',
    // paddingLeft: 0.2,
    // paddingRight: 12,
    // paddingVertical: 0.2,
    borderRadius: 50,
    alignItems: 'center',
  },
  detailContainer: {
    backgroundColor: 'blue',
    // paddingHorizontal: 200,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 5,
  },
  doubleContainer: {
    //  backgroundColor: 'red',
    width: '90%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
  },
  bgContainer: {
    backgroundColor: 'yellow',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    width: '53.7%',
    alignItems: 'center',
  },
  jobContainer: {
    // backgroundColor: 'white',
    paddingHorizontal: 34,
    paddingVertical: 10,
    borderRadius: 20,
  },
  detail: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 10,
  },
  job: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 8,
  },
  label3: {
    fontSize: 12,
    color: 'green',
    paddingHorizontal: 10,
  },
});

export default styles;
