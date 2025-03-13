import {View, Text, Image, ImageBackground} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {TouchableOpacityView} from '../TouchableOpacityView';
import {Stadium, battle, person, wallet_icon, bell} from '../../helper/image';
import styles from './styles';
import {AppSafeAreaView} from '../AppSafeAreaView';
import {useSelector} from 'react-redux';
import {RootState} from '../../libs/rootReducer';

const MatchComponent = () => {
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  return (
    <AppSafeAreaView style={styles.container(colors)}>
      <FastImage source={Stadium} style={styles.headerPart}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <FastImage source={person} style={styles.person} />

            <FastImage source={battle} style={styles.battle} />

            <View style={styles.bellWalletContainer}>
              <View style={styles.vectorLogo}>
                <FastImage source={bell} style={styles.image} />
              </View>
              <View>
                <FastImage source={wallet_icon} style={styles.wallet} />
              </View>
            </View>
          </View>
        </View>
      </FastImage>
    </AppSafeAreaView>
  );
};

export default MatchComponent;
