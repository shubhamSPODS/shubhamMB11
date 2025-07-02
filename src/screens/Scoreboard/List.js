import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {AppText, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, TWELVE, WHITE} from '../../common/AppText';
import {colors} from '../../theme/color';
import CommonImageBackground from '../../common/commonImageBackground';
import {Screen} from '../../theme/dimens';

const List = () => {
  // TODO: Replace with actual data from your API/state
  const scoreboards = [];

  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <CommonImageBackground common>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          {scoreboards.length > 0 ? (
            scoreboards.map((scoreboard, index) => (
              // TODO: Add your scoreboard item component here
              <View key={index} style={styles.scoreboardItem}>
                {/* Add your scoreboard item content */}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.emptyText}>
                No scoreboards added yet
              </AppText>
            </View>
          )}
        </ScrollView>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  scoreboardItem: {
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: Screen.Height * 0.5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default List; 