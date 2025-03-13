import {View, Text, StatusBar, Image, FlatList} from 'react-native';
import React, {useState} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  BLACK,
  EIGHT,
  ELEVEN,
  FORTEEN,
  LIGHTBLUE,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  RED,
  SIXTEEN,
  TEN,
  THIRTEEN,
  TWELVE,
  TWENTY,
  WHITE,
} from '../../common/AppText';
import styles from './styles';
import {useSelector} from 'react-redux';
import InputBox from '../../common/InputBox';
import {RootState} from '../../libs/rootReducer';
import Modal from 'react-native-modal';

import FastImage from 'react-native-fast-image';
import {
  phone,
  masterCard,
  deleteIcon,
  visaCard,
  paytm,
} from '../../helper/image';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import PrimaryButton from '../../common/primaryButton';
import SecondaryButton from '../../common/secondaryButton';
import {universalPaddingHorizontal} from '../../theme/dimens';
import NavigationService from '../../navigation/NavigationService';
import {ADD_CARD_SCREEN} from '../../navigation/routes';

const DATA = [
  {
    id: '1',
    source: masterCard,
    heading: 'Credit Card',
    number: 'XX 2155',
    subHeading: 'ICICI Bank',
    icon: deleteIcon,
    status: false,
  },
  {
    id: '2',
    source: visaCard,
    heading: 'Credit Card',
    number: ' XX 2155',
    subHeading: 'ICICI Bank',
    icon: deleteIcon,
    status: false,
  },
];

const ManagePayment = () => {
  const [mdlVisibile, setMdlVisible] = useState(false);

  const renderItem = ({item}) => {
    return (
      <View key={item.id} style={styles.box}>
        <View style={[styles.topContainer]}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.phoneContainer}>
              <FastImage
                source={item.source}
                resizeMode="contain"
                style={styles.card}
              />
            </View>
            <View style={styles.mobileContainer}>
              <View style={styles.cardContainer}>
                <AppText type={TWELVE} color={BLACK} style={styles.mobile2}>
                  {item.heading}{' '}
                </AppText>
                <AppText type={TWELVE} color={LIGHTBLUE}>
                  {item.number}
                </AppText>
              </View>

              <AppText type={TEN} style={styles.mobile}>
                {item.subHeading}
              </AppText>
            </View>
          </View>

          <TouchableOpacityView
            onPress={() => setMdlVisible(true)}
            style={styles.deleteContainer}>
            <FastImage
              source={item.icon}
              resizeMode="contain"
              style={styles.delete}
            />
          </TouchableOpacityView>
        </View>
      </View>
    );
  };

  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <Header
          style={{padding: universalPaddingHorizontal, marginTop: '10%'}}
          commonHeader
          title="Manage Payments"
        />
        <KeyBoardAware style={styles.bottomContainer}>
          {/* <AppText type={FORTEEN} style={styles.getVerified}>
            Credit/Debit Card
          </AppText>
          {DATA.map((item, index) => {
            return renderItem({item});
          })} */}
          {/* <TouchableOpacityView
            onPress={() => NavigationService.navigate(ADD_CARD_SCREEN)}
            style={styles.box}>
            <View style={[styles.topContainer]}>
              <AppText color={RED} type={TWELVE} style={styles.add}>
                Add new card
              </AppText>
            </View>
          </TouchableOpacityView> */}

          <AppText
            color={BLACK}
            type={FORTEEN}
            style={styles.options}>
            Other Options
          </AppText>

          <View style={styles.box}>
            <View style={[styles.topContainer]}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.phoneContainer}>
                  <FastImage
                    source={paytm}
                    resizeMode="contain"
                    style={styles.card}
                  />
                </View>
                <View style={styles.mobileContainer}>
                  <View style={styles.cardContainer}>
                    <AppText type={TWELVE} style={styles.mobile}>
                      Paytm Wallet
                    </AppText>
                  </View>
                </View>
              </View>

              <AppText type={TWELVE} style={styles.link}>
                Link Account
              </AppText>
            </View>
          </View>
        </KeyBoardAware>

        <Modal
          isVisible={mdlVisibile}
          style={{margin: 0}}
          animationIn="fadeIn"
          animationOut={'fadeOut'}
          hasBackdrop={true}
          onBackdropPress={() => setMdlVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#0003',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={styles.modalBox}>
              <AppText
                style={styles.modalText}
                color={WHITE}
                type={TWENTY}
                weight={POPPINS_SEMI_BOLD}>
                Are you sure you want to {'\n'} remove card?
              </AppText>
              <PrimaryButton title="REMOVE" />

              <SecondaryButton
                onPress={() => setMdlVisible(false)}
                title="CANCEL"
              />
            </View>
          </View>
        </Modal>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

export default ManagePayment;
