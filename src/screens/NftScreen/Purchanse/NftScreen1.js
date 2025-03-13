import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import styles from './styles';
import {AppSafeAreaView} from '../../../common/AppSafeAreaView';
import CommonImageBackground from '../../../common/commonImageBackground';
import Header from '../../../common/Header';

import SmallButton from '../../../common/smallButton/SmallButton';
import PurchaseAndRented from '../../../common/PurchaseAndRented/PurchaseAndRented';
import FlatList from '../../../common/FlatList1/FlatList';
import PrimaryButton from '../../../common/primaryButton';

const NftScreen1 = () => {
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container3}>
          <FlatList isPurchased={true} />
        </View>
      </ScrollView>
    </View>
  );
};

export default NftScreen1;

{
  /* <ScrollView>
  <View style={styles.container3}>
    <FlatList isPurchased={true} />
  </View>
</ScrollView>; */
}
