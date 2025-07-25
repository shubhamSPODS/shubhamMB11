import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  AppText,
  EIGHTEEN,
  SIXTEEN,
  FOURTEEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  WHITE,
} from '../../common/AppText';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { colors } from '../../theme/color';
import FastImage from "@d11/react-native-fast-image";

const HowToPlay = () => {
  const layout = useWindowDimensions();

  const howToPlaySteps = [
    {
      step: 1,
      title: "Select a Match",
      description: "Choose from upcoming cricket matches and join contests",
      icon: "🏏"
    },
    {
      step: 2,
      title: "Create Your Team",
      description: "Pick 11 players within the given credit limit. Choose your captain and vice-captain for bonus points",
      icon: "👥"
    },
    {
      step: 3,
      title: "Join Contests",
      description: "Enter contests with different entry fees and prize pools. Compete with other players",
      icon: "🏆"
    },
    {
      step: 4,
      title: "Track Performance",
      description: "Watch live scores and track your team's performance in real-time",
      icon: "📊"
    },
    {
      step: 5,
      title: "Win Prizes",
      description: "Earn points based on your players' real match performance and win cash prizes",
      icon: "💰"
    }
  ];

  const playerRoles = [
    {
      role: "Batsman",
      points: "1 point per run, 4 points for 4s, 6 points for 6s",
      icon: "🏏"
    },
    {
      role: "Bowler", 
      points: "10 points per wicket, 4 points per maiden over",
      icon: "🎯"
    },
    {
      role: "All-Rounder",
      points: "Combined batting and bowling points",
      icon: "⚡"
    },
    {
      role: "Wicket-Keeper",
      points: "10 points per catch/stumping, 1 point per run",
      icon: "🧤"
    }
  ];

  const tips = [
    "Always check player form and recent performance",
    "Consider pitch conditions and weather",
    "Balance your team with players from both teams",
    "Choose captain and vice-captain wisely for bonus points",
    "Monitor team news for last-minute changes"
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <AppText
        style={styles.mainTitle}
        type={EIGHTEEN}
        weight={POPPINS_SEMI_BOLD} 
        color={WHITE}>
        How to Play Fantasy Cricket
      </AppText>

      {/* Steps Section */}
      <View style={styles.section}>
        <AppText
          style={styles.sectionTitle}
          type={SIXTEEN}
          weight={POPPINS_SEMI_BOLD} 
          color={WHITE}>
          Step by Step Guide
        </AppText>
        
        {howToPlaySteps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepNumberContainer}>
              <AppText
                style={styles.stepNumber}
                type={FOURTEEN}
                weight={POPPINS_SEMI_BOLD} 
                color={WHITE}>
                {step.step}
              </AppText>
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <AppText style={styles.stepIcon}>{step.icon}</AppText>
                <AppText
                  style={styles.stepTitle}
                  type={FOURTEEN}
                  weight={POPPINS_SEMI_BOLD} 
                  color={WHITE}>
                  {step.title}
                </AppText>
              </View>
              <AppText
                style={styles.stepDescription}
                type={FOURTEEN}
                weight={POPPINS_MEDIUM} 
                color={WHITE}>
                {step.description}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Player Roles Section */}
      <View style={styles.section}>
        <AppText
          style={styles.sectionTitle}
          type={SIXTEEN}
          weight={POPPINS_SEMI_BOLD} 
          color={WHITE}>
          Player Roles & Points
        </AppText>
        
        {playerRoles.map((player, index) => (
          <View key={index} style={styles.playerRoleContainer}>
            <View style={styles.playerRoleHeader}>
              <AppText style={styles.playerRoleIcon}>{player.icon}</AppText>
              <AppText
                style={styles.playerRoleTitle}
                type={FOURTEEN}
                weight={POPPINS_SEMI_BOLD} 
                color={WHITE}>
                {player.role}
              </AppText>
            </View>
            <AppText
              style={styles.playerRolePoints}
              type={FOURTEEN}
              weight={POPPINS_MEDIUM} 
              color={WHITE}>
              {player.points}
            </AppText>
          </View>
        ))}
      </View>

      {/* Tips Section */}
      <View style={styles.section}>
        <AppText
          style={styles.sectionTitle}
          type={SIXTEEN}
          weight={POPPINS_SEMI_BOLD} 
          color={WHITE}>
          Pro Tips
        </AppText>
        
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipContainer}>
            <View style={styles.tipBullet}>
              <AppText style={styles.tipBulletText}>•</AppText>
            </View>
            <AppText
              style={styles.tipText}
              type={FOURTEEN}
              weight={POPPINS_MEDIUM} 
              color={WHITE}>
              {tip}
            </AppText>
          </View>
        ))}
      </View>

      {/* Important Notes */}
      <View style={styles.section}>
        <AppText
          style={styles.sectionTitle}
          type={SIXTEEN}
          weight={POPPINS_SEMI_BOLD} 
          color={WHITE}>
          Important Notes
        </AppText>
        
        <View style={styles.importantNoteContainer}>
          <AppText
            style={styles.importantNoteText}
            type={FOURTEEN}
            weight={POPPINS_MEDIUM} 
            color={WHITE}>
            • Captain gets 2x points, Vice-captain gets 1.5x points{'\n'}
            • Team must have 1-4 batsmen, 1-4 bowlers, 1-4 all-rounders, 1 wicket-keeper{'\n'}
            • Maximum 7 players from one team{'\n'}
            • Points are updated in real-time during the match{'\n'}
            • Contest results are finalized after match completion
          </AppText>
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: universalPaddingHorizontal,
    paddingTop: 20,
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 20,
    fontSize: 18,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.playerDetailsLinerOne,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumber: {
    color: WHITE,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  stepTitle: {
    fontSize: 16,
  },
  stepDescription: {
    lineHeight: 22,
    opacity: 0.9,
  },
  playerRoleContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  playerRoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerRoleIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  playerRoleTitle: {
    fontSize: 16,
  },
  playerRolePoints: {
    opacity: 0.9,
    lineHeight: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipBullet: {
    marginRight: 10,
    marginTop: 2,
  },
  tipBulletText: {
    color: colors.playerDetailsLinerOne,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    lineHeight: 22,
    opacity: 0.9,
  },
  importantNoteContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
  },
  importantNoteText: {
    lineHeight: 22,
    opacity: 0.9,
  },
});

export default React.memo(HowToPlay); 