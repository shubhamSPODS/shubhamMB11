import {View, Text, FlatList} from 'react-native';
import {AppSafeAreaView} from '../AppSafeAreaView';
import React from 'react';
import DATA from '../../DummyData';
import {RENTED_DATA} from '../../DummyData';
import Card from './Card';
const FlatListCard = ({isRented, isPurchased}) => {
  return (
    <AppSafeAreaView>
      <FlatList
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        data={isRented ? RENTED_DATA : DATA}
        renderItem={({item}) => <Card eachItem={item} />}
      />
    </AppSafeAreaView>
  );
};

export default FlatListCard;
