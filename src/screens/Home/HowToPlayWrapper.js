import React from 'react';
import { StatusBar, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { HomeTopHeader } from '../../common/HomeTopHeader';
import { KeyBoardAware } from '../../common/KeyboardAware';
import HowToPlay from './HowToPlay';
import { colors } from '../../theme/color';

const HowToPlayWrapper = React.memo(() => {
  const navigation = useNavigation();

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.getParent()?.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  // Use callback for consistent reference
  const handleBack = React.useCallback(() => {
    navigation.getParent()?.goBack();
  }, [navigation]);

  return (
    <AppSafeAreaView
      statusColor={true}
      style={{ flex: 1, backgroundColor: colors.black }}
      hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <HomeTopHeader
        showBack={true}
        personClick={handleBack}
        walletIcon={true}
      />
      <KeyBoardAware
        style={{ flex: 1, backgroundColor: colors.darkBlue }}>
        <HowToPlay />
      </KeyBoardAware>
    </AppSafeAreaView>
  );
});

export default HowToPlayWrapper; 