import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import styles from './styles';
import {scanner, arrow, imagePlaceholder, vector} from '../../helper/image';
import FastImage from 'react-native-fast-image';

const Scanner = () => (
  <View style={styles.container}>
    <View style={styles.topContainer}>
      <FastImage source={arrow} style={styles.arrow} />
      <FastImage source={vector} style={styles.arrow} />
    </View>
    <FastImage source={scanner} style={styles.scanner} />
    <FastImage source={imagePlaceholder} style={styles.imagePlaceholder} />
  </View>
);

export default Scanner;
