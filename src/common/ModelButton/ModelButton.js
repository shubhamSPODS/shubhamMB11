import {View, Text} from 'react-native';
import React from 'react';
import styles from './styles';
import {TouchableOpacityView} from '../TouchableOpacityView';
import {AppText} from '../AppText';
const ModelButton = () => {
  return (
    <TouchableOpacityView style={styles.container}>
      <AppText style={styles.nextText}>Next</AppText>
    </TouchableOpacityView>
  );
};

export default ModelButton;
