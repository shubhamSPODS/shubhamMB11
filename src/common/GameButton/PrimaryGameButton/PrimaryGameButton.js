import {View, Text, Image} from 'react-native';
import React from 'react';
import styles from './styles';
import {TouchableOpacityView} from '../../TouchableOpacityView';
import {AppText} from '../../AppText';
import FastImage from 'react-native-fast-image';
const PrimaryGameButton = props => {
  const {gameName, cricketpng} = props;
  return (
    <TouchableOpacityView style={styles.cricketContainer}>
      <View style={styles.textAndIconWrapper}>
        <FastImage
          source={cricketpng}
          style={styles.gamePng}
          resizeMode="contain"
        />
        <AppText style={styles.gameButtonText}>{gameName}</AppText>
      </View>
    </TouchableOpacityView>
  );
};

export default PrimaryGameButton;
