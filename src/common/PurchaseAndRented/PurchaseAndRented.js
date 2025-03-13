import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import styles from './styles';
import {AppSafeAreaView} from '../AppSafeAreaView';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacityView} from '../TouchableOpacityView';

import PurchaseList from '../../screens/NftScreen/Purchanse/NftScreen1';
import RentedList from '../../screens/NftScreen/Rented/Rented';
import {useState} from 'react';

const PurchaseAndRented = ({
  purchased,
  rented,
  handlePurchasedList,
  handleRentedFlatList,
  // active,
}) => {
  const [active, setActive] = useState(false);
  const component1 = PurchaseList;
  const component2 = RentedList;
  return (
    <View style={styles.mainContainer}>
      <View style={styles.wrapperContainer}>
        <TouchableOpacityView
          style={[styles.firstButton]}
          onPress={() => handlePurchasedList(component1)}>
          <Text>{purchased}</Text>
        </TouchableOpacityView>

        <TouchableOpacityView
          style={styles.secondButton}
          onPress={() => handleRentedFlatList(component2)}>
          <Text>{rented}</Text>
        </TouchableOpacityView>
      </View>
    </View>
  );
};

export default PurchaseAndRented;
