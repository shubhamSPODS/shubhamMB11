import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import styles from './styles';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import CommonImageBackground from '../../common/commonImageBackground';
import Header from '../../common/Header';

// import SmallButton from "../../common/smallButton";
import PurchaseAndRented from '../../common/PurchaseAndRented/PurchaseAndRented';
import FlatList from '../../common/FlatList1/FlatList';
import PrimaryButton from '../../common/primaryButton';
import {useState} from 'react';
import Purchase from '../NftScreen/Purchanse/NftScreen1';

const Nfc = () => {
  const [flatPurchasedList, setFlatPurchasedList] = useState(Purchase);
  const [rentedFlatList, setRentedFlatList] = useState();

  const handlePurchasedList = purchase => {
    setFlatPurchasedList(purchase);
  };

  const handleRentedFlatList = rented => {
    setRentedFlatList(rented);
    setFlatPurchasedList(false);

  };

  return (
    <AppSafeAreaView>
      <CommonImageBackground common>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            {/* Container-1 (start) */}
            <View style={styles.container1}>
              <View style={styles.combinedContainer}>
                <View>
                  <Header title="My NFT’s" commonHeader />
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}>
                  <PrimaryButton title="Buy More" smallBtn={styles.btnStyle} />
                </View>
              </View>
            </View>
            {/* Container-1 (End) */}
            <View style={styles.container2}>
              <PurchaseAndRented
                purchased="Purchased"
                rented="Rented"
                handlePurchasedList={handlePurchasedList}
                handleRentedFlatList={handleRentedFlatList}
              />
            </View>

            {flatPurchasedList ? (
              <ScrollView>
                {flatPurchasedList && (
                  <View style={styles.container3}>
                    <FlatList isPurchased={true} />
                  </View>
                )}
              </ScrollView>
            ) : (
              <ScrollView>
                <View style={styles.container3}>
                  <FlatList isRented={true} />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

export default Nfc;
