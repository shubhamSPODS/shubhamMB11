import {View, Text, Image} from 'react-native';
import React from 'react';
import styles from './styles';
import {TouchableOpacityView} from '../../TouchableOpacityView';
import FastImage from 'react-native-fast-image';
import {AppText} from '../../AppText';
const SecondaryGameButton = props => {
  const {gameName, footballPng} = props;
  return (
    <TouchableOpacityView style={styles.footballContainer}>
      <View style={styles.textAndIconWrapper}>
        <FastImage source={footballPng} style={styles.gamePng} />
        <AppText style={styles.footballName}>{gameName}</AppText>
      </View>
    </TouchableOpacityView>
  );
};

export default SecondaryGameButton;
