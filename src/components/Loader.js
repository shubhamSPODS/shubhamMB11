import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import AppText, { SEMI_BOLD,POPPINS_MEDIUM, BOLD } from '../common/AppText';
import { colors } from '../theme/color';

const Loader = ({ visible = false, textAppear = false }) => {
  const [dots, setDots] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // Reset animations to initial state
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);

      // Start fade in animation
      const animation = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        })
      ]);

      animationRef.current = animation;
      animation.start();

      // Animate dots
      let count = 0;
      const interval = setInterval(() => {
        count = (count + 1) % 4;
        setDots('.'.repeat(count));
      }, 500);

      return () => {
        clearInterval(interval);
        if (animationRef.current) {
          animationRef.current.stop();
        }
      };
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.fullscreenOverlay}>
      <Animated.View style={[
        styles.contentContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <LottieView
          source={require('../../assets/animation/loader.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
          onError={(error) => console.error('Lottie animation error:', error)}
        />
        {textAppear && (
          <>
            <View style={styles.textContainer}>
              <Text  style={styles.mainText}>Finding Match</Text>
              <Text style={styles.dotsText}>{dots}</Text>


              {/* <AppText size={30}  color={colors.golden} style={styles.mainText}>
                Finding Match
              </AppText> */}
              {/* <AppText size={30} color={colors.golden} style={styles.dotsText}>
                {dots}
              </AppText> */}
            </View>
              <Text style={styles.getReady}>Get ready for an epic battle!</Text>

            {/* <AppText size={12} color={colors.white} >
              Get ready for an epic battle!
            </AppText> */}
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 300,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    zIndex:9999
  },
  mainText: {
    color:colors.golden,
    fontFamily:BOLD,
    fontWeight:'800',
    // textShadowColor: 'rgba(255, 215, 0, 0.5)',
    // textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    fontSize:30
  },
  dotsText: {
    fontSize:30,
    color:colors.golden,
    // textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  getReady: {
     fontSize:20,
    marginTop: 10,
    color: colors.golden
  }
});

export default Loader;
