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
      title: "Choose Game Type",
      description: "Select between Team contests (pick players) or Scoreboard contests (predict runs per over)",
      icon: "🎯"
    },
    {
      step: 3,
      title: "Create Your Team / Predict Runs",
      description: "For Teams: Pick 11 players within credit limit. For Scoreboard: Predict runs for each over",
      icon: "👥"
    },
    {
      step: 4,
      title: "Join Contests",
      description: "Enter contests with different entry fees and prize pools. Compete with other players",
      icon: "🏆"
    },
    {
      step: 5,
      title: "Track Performance",
      description: "Watch live scores and track your predictions/team performance in real-time",
      icon: "📊"
    },
    {
      step: 6,
      title: "Win Prizes",
      description: "Earn points based on your predictions/players' performance and win cash prizes",
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

  const scoreboardTips = [
    "Study team's batting patterns in recent matches",
    "Consider pitch conditions and weather for run prediction",
    "Analyze bowling strength of the opposition",
    "Check if it's a batting or bowling friendly pitch",
    "Monitor team's performance in powerplay and death overs"
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

      {/* Scoreboard Matches Section */}
      <View style={styles.section}>
        <AppText
          style={styles.sectionTitle}
          type={SIXTEEN}
          weight={POPPINS_SEMI_BOLD} 
          color={WHITE}>
          Scoreboard Matches
        </AppText>
        
        <View style={styles.scoreboardContainer}>
          <AppText
            style={styles.scoreboardDescription}
            type={FOURTEEN}
            weight={POPPINS_MEDIUM} 
            color={WHITE}>
            In Scoreboard matches, you predict the number of runs that will be scored in each over of the match. Points are awarded based on how close your predictions are to the actual runs scored.
          </AppText>
          
          <View style={styles.scoreboardPointsContainer}>
            <AppText
              style={styles.scoreboardPointsTitle}
              type={FOURTEEN}
              weight={POPPINS_SEMI_BOLD} 
              color={WHITE}>
              Points System:
            </AppText>
            <View style={styles.pointsList}>
              <View style={styles.pointItem}>
                <AppText style={styles.pointBullet}>•</AppText>
                <AppText style={styles.pointText}>Exact prediction: 10 points</AppText>
              </View>
              <View style={styles.pointItem}>
                <AppText style={styles.pointBullet}>•</AppText>
                <AppText style={styles.pointText}>Within ±10 runs of actual score: 1 point deducted for each run difference</AppText>
              </View>
              <View style={styles.pointItem}>
                <AppText style={styles.pointBullet}>•</AppText>
                <AppText style={styles.pointText}>Beyond ±10 runs: 0 points</AppText>
              </View>
            </View>
            
            <View style={styles.exampleContainer}>
              <AppText
                style={styles.exampleTitle}
                type={FOURTEEN}
                weight={POPPINS_SEMI_BOLD} 
                color={WHITE}>
                Examples:
              </AppText>
              <View style={styles.exampleList}>
                <View style={styles.exampleItem}>
                  <AppText style={styles.exampleBullet}>•</AppText>
                  <AppText style={styles.exampleText}>Actual: 15, Predicted: 15 → 10 points</AppText>
                </View>
                <View style={styles.exampleItem}>
                  <AppText style={styles.exampleBullet}>•</AppText>
                  <AppText style={styles.exampleText}>Actual: 15, Predicted: 14 or 16 → 9 points</AppText>
                </View>
                <View style={styles.exampleItem}>
                  <AppText style={styles.exampleBullet}>•</AppText>
                  <AppText style={styles.exampleText}>Actual: 15, Predicted: 5 or 25 → 0 points (beyond ±10 range)</AppText>
                </View>
                <View style={styles.exampleItem}>
                  <AppText style={styles.exampleBullet}>•</AppText>
                  <AppText style={styles.exampleText}>Actual: 15, Predicted: 6 or 24 → 1 point</AppText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Team Contest Tips Section */}
      <View style={styles.section}>
        <AppText
          style={styles.sectionTitle}
          type={SIXTEEN}
          weight={POPPINS_SEMI_BOLD} 
          color={WHITE}>
          Team Contest Tips
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

      {/* Scoreboard Contest Tips Section */}
      <View style={styles.section}>
        <AppText
          style={styles.sectionTitle}
          type={SIXTEEN}
          weight={POPPINS_SEMI_BOLD} 
          color={WHITE}>
          Scoreboard Contest Tips
        </AppText>
        
        {scoreboardTips.map((tip, index) => (
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
            <AppText style={styles.noteSectionTitle}>Team Contests:{'\n'}</AppText>
            • Captain gets 2x points, Vice-captain gets 1.5x points{'\n'}
            • Team must have 1-4 batsmen, 1-4 bowlers, 1-4 all-rounders, 1 wicket-keeper{'\n'}
            • Maximum 7 players from one team{'\n'}
            {'\n'}
            <AppText style={styles.noteSectionTitle}>Scoreboard Contests:{'\n'}</AppText>
            • Predict runs for each over before the match starts{'\n'}
            • Points awarded based on prediction accuracy{'\n'}
            • All predictions must be submitted before match begins{'\n'}
            {'\n'}
            <AppText style={styles.noteSectionTitle}>General:{'\n'}</AppText>
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
  scoreboardContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
  },
  scoreboardDescription: {
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: 15,
  },
  scoreboardPointsContainer: {
    marginTop: 10,
  },
  scoreboardPointsTitle: {
    marginBottom: 10,
  },
  pointsList: {
    marginLeft: 10,
  },
  pointItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  pointBullet: {
    color: colors.playerDetailsLinerOne,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 2,
  },
  pointText: {
    flex: 1,
    lineHeight: 20,
    opacity: 0.9,
  },
  noteSectionTitle: {
    fontWeight: 'bold',
    color: colors.playerDetailsLinerOne,
  },
  exampleContainer: {
    marginTop: 15,
    backgroundColor: '#0f0f0f',
    padding: 12,
    borderRadius: 8,
  },
  exampleTitle: {
    marginBottom: 10,
  },
  exampleList: {
    marginLeft: 5,
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  exampleBullet: {
    color: colors.playerDetailsLinerOne,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  exampleText: {
    flex: 1,
    lineHeight: 18,
    opacity: 0.9,
    fontSize: 13,
  },
});

export default React.memo(HowToPlay); 