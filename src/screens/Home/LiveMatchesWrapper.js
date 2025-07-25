import React from 'react';
import { StatusBar, RefreshControl, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { HomeTopHeader } from '../../common/HomeTopHeader';
import { KeyBoardAware } from '../../common/KeyboardAware';
import LiveMatches from './LiveMatches';
import { colors } from '../../theme/color';

const LiveMatchesWrapper = React.memo(() => {
  const [refreshingTwo, setRefreshingTwo] = React.useState(false);
  const [random, setRandom] = React.useState(0);
  const navigation = useNavigation();

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.getParent()?.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  // Use callback to prevent recreation on each render
  const handleRefresh = React.useCallback(() => {
    setRandom(prev => prev + 1);
  }, []);

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
        refreshControl={
          <RefreshControl refreshing={refreshingTwo} onRefresh={handleRefresh} />
        }
        style={{ flex: 1, backgroundColor: colors.darkBlue }}>
        <LiveMatches random={random} setRefreshingTwo={setRefreshingTwo} />
      </KeyBoardAware>
    </AppSafeAreaView>
  );
});

export default LiveMatchesWrapper; 