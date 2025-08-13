import React from 'react';
import { View, StyleSheet, BackHandler, Platform } from 'react-native';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
import { AppText, POPPINS_BOLD, POPPINS_MEDIUM } from '../common/AppText';
import { colors } from '../theme/color';
import PrimaryButton from '../common/primaryButton';
import NavigationService from '../navigation/NavigationService';

const BannedState = ({ route }: any) => {
  const stateName = route?.params?.stateName || 'your state';
  return (
    <AppSafeAreaView hidden={false}>
      <View style={styles.container}>
        <AppText weight={POPPINS_BOLD} style={styles.title}>
          Access Restricted
        </AppText>
        <AppText weight={POPPINS_MEDIUM} style={styles.message}>
          You cannot use this app in {stateName} as betting applications are banned in this state.
        </AppText>
        <View style={styles.bottomBar}>
          <PrimaryButton
            title="Exit"
            buttonStyle={styles.exitButton}
            onPress={() => {
              // Close the app so the user cannot access features
              if (Platform.OS === 'android') {
                BackHandler.exitApp();
              } else {
                // iOS does not allow programmatic exit; keep them on this screen
                // Optionally, you could deep-link to settings or just do nothing
              }
            }}
          />
        </View>
      </View>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 24,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: 16,
  },
  exitButton: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default BannedState;


