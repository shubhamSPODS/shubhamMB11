import React, { useState, useEffect } from 'react';

import {
  TouchableOpacity,
  Image,
  ImageBackgroundBase,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ImageBackground,
} from 'react-native';

const Splash = ({ navigation }) => {
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFirst(true);
    }, 1000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSecond(true);
    }, 2000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
  });

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>

      {first ? (
        <Image
          style={styles.poster}
          source={require('../../assets/images/Splash.png')}
        />
      ) : null}
      {second ? (
        <Image
          style={styles.logos}
          source={require('../../assets/images/Splash.png')}
        />
      ) : null}


    </View>
  );
};

const styles = StyleSheet.create({
  poster: {
    flex: 2,
    width: '100%',
    resizeMode: 'cover',
    paddingTop: 5,

  },
  logos: {
    flex: 2,
    width: '100%',
    resizeMode: 'cover',
    paddingTop: 5,
  },
});

export default Splash;
