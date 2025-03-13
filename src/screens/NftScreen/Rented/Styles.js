import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 10,
    borderWidth: 2,

    flexDirection: 'column',
  },
  wrapper: {
    height: '100%',
    flexDirection: 'column',
  },

  container2: {
    marginTop: 20,
  },
  container3: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  combinedContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnStyle: {
    width: 100,
  },
});

export default styles;
