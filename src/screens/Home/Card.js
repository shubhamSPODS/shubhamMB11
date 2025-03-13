import React from 'react';
import {View, ImageBackground, Text,Image,TouchableOpacity,StyleSheet} from 'react-native';
import {LINEAR_GRADIENT, SHAPE, MI, SRH, LIVE} from '../../helper/image';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from '../../navigation/NavigationService';
import {
  Single_Ipl_Card
} from '../../navigation/routes';


const Card = () => {
  return (
<TouchableOpacity  onPress={() =>
                  NavigationService.navigate(Single_Ipl_Card)
                } >
    <View style={styles.cardContainer}>
      <View style={{flexDirection:"row",justifyContent:"space-between",width:"90%",alignSelf:"center",top:15}}>
        <Text style={{fontSize:12,fontWeight:"400",color:"#FFFFFF"}}>Indian Premium League</Text>
        <Image
              style={{
                width: 14,
                height: 14,
                resizeMode: 'contain',
              }}
              source={require('../../../assets/images/n1.png')}
            />
      </View>
      <LinearGradient
                style={{
                  height:1,
                  width:"90%",
                  alignSelf:"center",
                  top:30
                }}
                start={{x: 1, y: 0}}
                end={{x: 0, y:1}}
                colors={['#4F7ABA','#E18FFF']}>
                  </LinearGradient>
     
   
        <Text style={{fontWeight:"500",fontSize:10,color:"#15CE31",alignSelf:"center",top:40}}>3h 29m</Text>
        <View style={styles.teamContainer}>
          <FastImage source={MI} style={styles.teamImage} />
          <Text style={styles.live}>Today</Text>
          <FastImage source={SRH} style={styles.teamImage} />
        </View>
   
      <View style={styles.bottom}>
        <View style={{borderWidth:1,borderColor:"#15CE31",height:16,width:38,borderRadius:4,alignItems:"center"}}>
          <Text style={{fontWeight:"700",fontSize:9,color:"#15CE31"}}>MEGA</Text>
        </View>
        <Text style={{fontWeight:"600",fontSize:10,color:"#FFFFFF",right:60}}>INR 1 Crore</Text>
        <View style={{flexDirection:"row",justifyContent:"space-evenly",alignContent:"center"}}>
      <View style={{height:8,width:8,backgroundColor:"#15CE31",borderRadius:30,alignSelf:"center",left:15}}/>
        <Text style={[styles.textStyle, styles.paddingLeft20]}>LINEUP OUT</Text>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default Card;
const styles = StyleSheet.create({
  cardContainer: {
    height: 145,
    width: 353,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
    borderWidth:1,
    borderColor:"#16406F"
  },
  matchImage: {
    height: 111 - 22,
    width: '100%',
    resizeMode: 'contain',
  },
  bottom: {
    height: 22,
    backgroundColor: '#1F2A2C',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    bottom:50,
    justifyContent:"space-between"
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 20,
    bottom:10
  },
  shape: {
    width: 111,
    height: 29,
    position: 'absolute',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  teamImage: {
    height: 66,
    width: 72,
    resizeMode: 'contain',
  },
  live: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight:"500",
    fontFamily:"Montserrat",

  },
  textStyle: {
    color: '#15CE31',
    fontSize: 10,
    fontWeight:"500"
  },
  paddingLeft20: {
    paddingLeft: 20,
  },
});