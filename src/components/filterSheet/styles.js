import {StyleSheet, View} from 'react-native';
import {NewColor, colors} from '../../theme/color';

const styles = StyleSheet.create({
  top: {
    height: 54,
    width: '100%',
    backgroundColor: NewColor.linerBlacklight,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeIcon: {
    height: 12,
    width: 12,
  },
  label: {
    color: 'white',
    fontSize: 11,
    marginTop: 5,
    marginBottom:5
  },
  entryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  entry: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.borderLightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  entry2: {
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: colors.borderLightBlue,
    backgroundColor:colors.borderLightBlue
  },
  amount: {
    color: 'white',
    fontSize: 11,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default styles;
