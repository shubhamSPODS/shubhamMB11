import {View, Text, Image} from 'react-native';
import React from 'react';
import styles from './styles';
import {TouchableOpacityView} from '../common/TouchableOpacityView';
import {
  arrow,
  VectorLogo,
  BATTLEINFINITY,
  bellIcon,
  walletIcon,
} from '../helper/image';
import FastImage from 'react-native-fast-image';
import NavigationService from '../navigation/NavigationService';
import {Match_Remainder} from '../navigation/routes';
const HomeTopHeader = ({handleModel, arrow}) => {
  return (
    <View style={styles.headerTop}>
      <View>
        <TouchableOpacityView
          onPress={handleModel}
          style={styles.personIconContainer}>
          <FastImage
            source={arrow}
            style={styles.personImg}
            resizeMode="contain"
          />
        </TouchableOpacityView>
      </View>

      <View style={styles.logoContainer}>
        <View style={styles.vectorLogo}>
          <FastImage
            source={VectorLogo}
            style={{  height: 46,
              width: 51,top:5}}
            resizeMode="contain"
          />
        </View>
        <View style={{flexDirection:"column"}}>
          <View style={{flexDirection:"row",justifyContent:"space-evenly",}}>
          <Text style={{fontSize:12,fontWeight:"500",color:"#FFFFFF",fontFamily:"Montserrat"}}>
            LFC
          </Text>
          <Text style={{fontSize:10,fontWeight:"500",color:"#FFFFFF",fontFamily:"Montserrat",top:2}}>VS</Text>
          <Text style={{fontSize:12,fontWeight:"500",color:"#FFFFFF",fontFamily:"Montserrat"}}>CFC</Text>
          </View>
          <View style={{width:65,height:22,backgroundColor:"#D9D9D9",borderRadius:4,justifyContent:"center",alignItems:"center",top:5}}>
          <Text style={{fontSize:12,fontWeight:"700",color:"#FFFFFF",fontFamily:"Montserrat"}}>3h 29 m</Text>
          </View>
        </View>
        <View>
          <FastImage
            source={BATTLEINFINITY}
            style={styles.logoName}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.bellWalletContainer}>
        <TouchableOpacityView   onPress={() => NavigationService.navigate(Match_Remainder)} style={styles.vectorLogo}>
          <FastImage
            source={bellIcon}
            style={styles.bellIcon}
            resizeMode="contain"
          />
        </TouchableOpacityView>
        <View>
          <FastImage
            source={walletIcon}
            style={styles.walletIcon}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeTopHeader;
