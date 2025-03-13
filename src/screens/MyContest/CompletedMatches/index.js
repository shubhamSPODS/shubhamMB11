
import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import FlatSlider from '../../../common/FlatSlider/FlatSlider';

import styles from './styles';

const LiveMatches = () => {
  return (
    <ScrollView contentContainerStyle={{paddingHorizontal: 10,width:"95%",alignSelf:"center"}}>
      <FlatSlider />
    </ScrollView>
  );
};

export default LiveMatches;
