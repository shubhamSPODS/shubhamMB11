import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  BackHandler,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {HomeTopHeader} from '../../common/HomeTopHeader';
import {AppText, BROWNYELLOW, GRY, POPPINS_MEDIUM, FORTEEN, SIXTEEN} from '../../common/AppText';
import {NewColor, colors} from '../../theme/color';
import FastImage from '@d11/react-native-fast-image';
import {howto} from '../../helper/image';

const LudoHowToPlay = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.goBack();
        return true;
      });

      return () => backHandler.remove();
    }, [navigation])
  );

  const gameRules = [
    {
      title: 'Objective',
      description: 'Be the first player to move all four tokens from the starting area to the home area by rolling dice and moving tokens around the board.',
    },
    {
      title: 'Game Setup',
      description: 'Each player has 4 tokens and starts from their respective starting area. Players take turns rolling a single die.',
    },
    {
      title: 'Moving Tokens',
      description: 'Roll a 6 to move a token out of the starting area. On subsequent turns, move tokens according to the number rolled.',
    },
    {
      title: 'Safe Squares',
      description: 'Tokens on safe squares (marked with stars) cannot be captured by other players.',
    },
    {
      title: 'Capturing',
      description: 'If your token lands on an opponent\'s token, the opponent\'s token returns to its starting area.',
    },
    {
      title: 'Home Stretch',
      description: 'Once a token completes one full round, it enters the home stretch and must reach the center to win.',
    },
    {
      title: 'Winning',
      description: 'The first player to get all four tokens to the center wins the game.',
    },
  ];

  const gameModes = [
    {
      title: 'Classic Mode',
      description: 'Traditional Ludo gameplay with standard rules. First player to get all tokens home wins.',
    },
    {
      title: 'Timer Mode',
      description: '7-minute quick game where all tokens are ready to move. Score points for each step and bonus points for reaching home.',
    },
    {
      title: 'Ludo 51',
      description: 'Each player gets 51 moves. All tokens start ready to move. Player with highest points wins.',
    },
  ];

  return (
    <AppSafeAreaView
      statusColor={true}
      style={styles.container}
      hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <HomeTopHeader
        showBack={true}
        personClick={() => navigation.goBack()}
        title="How to Play Ludo"
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <AppText
            style={styles.headerTitle}
            color={BROWNYELLOW}
            weight={POPPINS_MEDIUM}
            type={SIXTEEN}>
            Learn How to Play Ludo
          </AppText>
          <AppText
            style={styles.headerSubtitle}
            color={GRY}
            weight={POPPINS_MEDIUM}
            type={FORTEEN}>
            Master the classic board game with our comprehensive guide
          </AppText>
        </View>

        {/* Game Modes Section */}
        <View style={styles.section}>
          <AppText
            style={styles.sectionTitle}
            color={BROWNYELLOW}
            weight={POPPINS_MEDIUM}
            type={SIXTEEN}>
            Game Modes
          </AppText>
          {gameModes.map((mode, index) => (
            <View key={index} style={styles.ruleCard}>
              <AppText
                style={styles.ruleTitle}
                color={colors.white}
                weight={POPPINS_MEDIUM}
                type={FORTEEN}>
                {mode.title}
              </AppText>
              <AppText
                style={styles.ruleDescription}
                color={GRY}
                weight={POPPINS_MEDIUM}
                type={FORTEEN}>
                {mode.description}
              </AppText>
            </View>
          ))}
        </View>

        {/* Game Rules Section */}
        <View style={styles.section}>
          <AppText
            style={styles.sectionTitle}
            color={BROWNYELLOW}
            weight={POPPINS_MEDIUM}
            type={SIXTEEN}>
            Game Rules
          </AppText>
          {gameRules.map((rule, index) => (
            <View key={index} style={styles.ruleCard}>
              <AppText
                style={styles.ruleTitle}
                color={colors.white}
                weight={POPPINS_MEDIUM}
                type={FORTEEN}>
                {rule.title}
              </AppText>
              <AppText
                style={styles.ruleDescription}
                color={GRY}
                weight={POPPINS_MEDIUM}
                type={FORTEEN}>
                {rule.description}
              </AppText>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <AppText
            style={styles.sectionTitle}
            color={BROWNYELLOW}
            weight={POPPINS_MEDIUM}
            type={SIXTEEN}>
            Pro Tips
          </AppText>
          <View style={styles.ruleCard}>
            <AppText
              style={styles.ruleDescription}
              color={GRY}
              weight={POPPINS_MEDIUM}
              type={FORTEEN}>
              • Try to keep multiple tokens on the board to increase your chances of capturing opponents{'\n'}
              • Use safe squares strategically to protect your tokens{'\n'}
              • Plan your moves ahead, especially when approaching the home stretch{'\n'}
              • Don't forget that you need exactly the right number to enter the home area{'\n'}
              • In timer mode, focus on quick moves and maximizing points{'\n'}
              • In Ludo 51, prioritize high-scoring moves and strategic positioning
            </AppText>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 0,
  },
  headerIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
    tintColor: colors.brownYellow,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  ruleCard: {
    backgroundColor: colors.darkBlue,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.brownYellow,
  },
  ruleTitle: {
    marginBottom: 8,
  },
  ruleDescription: {
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default LudoHowToPlay; 