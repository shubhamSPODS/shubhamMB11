import {View, Text} from 'react-native';
import React from 'react';
import styles from './styles';
const TopSliderFlatList = () => {
  return (
    <View style={styles.container}>
      <Text>Sort By:</Text>
      <Text>ENTRY</Text>
      <Text>SPOTS</Text>
      <Text>PRIZE POOL</Text>
      <Text>%WINNER</Text>
    </View>
  );
};

export default TopSliderFlatList;
