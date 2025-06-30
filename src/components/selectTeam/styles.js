import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/color';
import { universalPaddingHorizontal } from '../../theme/dimens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: universalPaddingHorizontal,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: universalPaddingHorizontal,
  },
  buttonContainer: {
    paddingHorizontal: universalPaddingHorizontal,
    paddingVertical: 10,
  },
  buttonStyle: {
    width: '100%',
  },
  closeContainer: {
    padding: 5,
  },
  closeWhiteIcon: {
    height: 20,
    width: 20,
  },
  teamCountContainer: {
    backgroundColor: '#343434',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  teamCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamCountBox: {
    flex: 1,
  },
  teamCountDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.white,
    opacity: 0.1,
    marginHorizontal: 15,
  },
});

export default styles;
