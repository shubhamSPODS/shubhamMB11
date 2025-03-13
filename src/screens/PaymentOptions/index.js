import {View, Text, StatusBar, Image, FlatList} from 'react-native';
import React, {useState} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  EIGHT,
  EIGHTEEN,
  ELEVEN,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  SIXTEEN,
  TEN,
  THIRTEEN,
  TWELVE,
} from '../../common/AppText';
import styles from './styles';
import {useSelector} from 'react-redux';
import InputBox from '../../common/InputBox';
import {RootState} from '../../libs/rootReducer';

import FastImage from 'react-native-fast-image';
import {
  masterCard,
  paytm,
  rewards,
  nft,
  eighth,
  right_arrow,
  visaCard,
} from '../../helper/image';
import {RadioButton} from 'react-native-paper';
import PrimaryButton from '../../common/primaryButton';
import TripleToggle from '../../common/TrippleToggle';

const data = [
  {
    id: '1',
    source: rewards,
    heading: 'INR 50',
    subHeading: 'Pay with Referral Cash Bonus',
  },
];

const recomendedData = [
  {
    id: '1',
    source: eighth,
    heading: 'IBAT',
    arrow: right_arrow,
  },
  {
    id: '2',
    source: nft,
    heading: 'NFT Passes',
    arrow: right_arrow,
  },
];

const DATA = [
  {
    id: '1',
    source: masterCard,
    heading: 'Credit Card',
    number: 'XX 2155',
    subHeading: 'ICICI Bank',
    type: 'Verified',
  },
  {
    id: '2',
    source: visaCard,
    heading: 'Credit Card',
    number: 'XX 2155',
    subHeading: 'ICICI Bank',
    type: 'Verified',
  },
];

const otherData = [
  {
    id: '1',
    source: paytm,
    heading: 'Paytm Wallet',
    subHeading: 'Link Account',
  },
];

const PaymentOptions = () => {
  const [checked, setChecked] = React.useState('first');

  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });

  const renderTop = ({item}) => {
    return (
      <View style={styles.box(colors)}>
        <View style={[styles.boxContainer, styles.topContainer]}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.phoneContainer(colors)}>
              <FastImage source={item.source} style={styles.imageContainer} />
            </View>
            <View style={styles.mobileContainer}>
              <AppText type={TWELVE} style={styles.heading(colors)}>
                {item.heading}
              </AppText>
              <AppText type={TEN} style={styles.mobile(colors)}>
                {item.subHeading}
              </AppText>
            </View>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton
              value="first"
              status={checked === 'second' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('first')}
              color={colors.code}
            />
          </View>
        </View>
      </View>
    );
  };

  const recommended = ({item}) => {
    return (
      <View style={styles.box(colors)}>
        <View style={[styles.boxContainer, styles.topContainer]}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.phoneContainer(colors)}>
              <FastImage source={item.source} style={styles.imageContainer} />
            </View>
            <View style={styles.mobileContainer}>
              <AppText type={TWELVE} style={styles.mobile(colors)}>
                {item.heading}
              </AppText>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <FastImage style={styles.rightArrow} source={right_arrow} />
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.box(colors)}>
        <View style={[styles.boxContainer, styles.topContainer]}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.phoneContainer(colors)}>
              <FastImage source={item.source} style={styles.imageContainer} />
            </View>
            <View style={styles.mobileContainer}>
              <View style={styles.creditCard}>
                <AppText type={TWELVE} style={styles.mobile(colors)}>
                  {item.heading}
                </AppText>

                <AppText type={TWELVE} style={styles.number(colors)}>
                  {item.number}
                </AppText>
              </View>

              <AppText type={TEN} style={styles.mobile(colors)}>
                {item.subHeading}
              </AppText>
            </View>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('first')}
              color={colors.code}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderData = ({item}) => {
    return (
      <View style={styles.box(colors)}>
        <View style={[styles.boxContainer, styles.topContainer]}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.phoneContainer(colors)}>
              <FastImage source={item.source} style={styles.imageContainer} />
            </View>
            <View style={styles.mobileContainer}>
              <AppText type={TWELVE} style={styles.mobile(colors)}>
                {item.heading}
              </AppText>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <AppText style={styles.link(colors)}>{item?.subHeading}</AppText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <StatusBar hidden={false} />
      <KeyBoardAware>
        <CommonImageBackground common>
          <View style={styles.bottomContainer}>
            <Header commonHeader title="
            <AppText type={THIRTEEN} style={styles.getVerified(colors)}>
              Add INR 50.0
            </AppText>

            {/* <View style={styles.box(colors)}>
              <View style={[styles.boxContainer, styles.topContainer]}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.phoneContainer(colors)}>
                    <FastImage source={eighth} style={styles.eighth} />
                  </View>
                  <View style={styles.mobileContainer}>
                    <AppText type={TWELVE} style={styles.mobile(colors)}>
                      1.205
                    </AppText>
                    <AppText type={TWELVE} style={styles.mobile(colors)}>
                      Pay with IBAT
                    </AppText>
                  </View>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton
                    value="first"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('first')}
                    color={colors.code}
                  />
                </View>
              </View>
            </View> */}

            <FlatList
              data={data}
              renderItem={renderTop}
              keyExtractor={item => item.id}
              horizontal={false}
            />
            <AppText type={THIRTEEN} style={styles.connect(colors)}>
              Recommended
            </AppText>

            <FlatList
              data={recomendedData}
              renderItem={recommended}
              keyExtractor={item => item.id}
              horizontal={false}
            />

            <AppText type={THIRTEEN} style={styles.connect(colors)}>
              Credit/Debit Card
            </AppText>

            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              horizontal={false}
            />

            <View style={styles.box(colors)}>
              <View style={styles.topContainer}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.mobileContainer}>
                    <View style={styles.creditCard}>
                      <AppText type={TWELVE} style={styles.add(colors)}>
                        Add new card
                      </AppText>
                    </View>
                  </View>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton
                    value="first"
                    status={checked === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('first')}
                    color={colors.code}
                  />
                </View>
              </View>
            </View>

            <AppText style={styles.connect(colors)}>Other Options</AppText>
            <FlatList
              data={otherData}
              renderItem={renderData}
              keyExtractor={item => item.id}
              horizontal={false}
            />
          </View>
        </CommonImageBackground>
      </KeyBoardAware>
    </AppSafeAreaView>
  );
};

export default PaymentOptions;
