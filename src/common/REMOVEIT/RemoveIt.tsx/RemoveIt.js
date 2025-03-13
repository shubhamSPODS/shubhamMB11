import {View, Text, ScrollView} from 'react-native';
import React from 'react';

import styles from './styles';
import {TouchableOpacityView} from '../TouchableOpacityView';
import FastImage from 'react-native-fast-image';

import SliderBg from '../../../assets/images/sliderBg.png';

import MumbaiIndianImg from '../../../assets/images/MumbaiIndian.png';
import OpponentTeamImg from '../../../assets/images/sunriseHyd.png';

import IplTextContainer from '../../../assets/images/IplTextContainer.png';

import {ContextBg, forwardIcon} from '../../helper/image';
import TopSliderFlatList from '../TopSliderFlatList/TopSliderFlatList';
import {AppSafeAreaView} from '../AppSafeAreaView';
import HomeTopHeader from '../../HomeTopHeader/HomeTopHeader';
import {AppText} from '../AppText';
import Swipper from '../Swipper/Swipper';
import FlatSlider from '../FlatSlider/FlatSlider';
import {contextBgNew} from '../../helper/image';
import SingleCard from '../SingleCard/SingleCard';
import LinearGradient from 'react-native-linear-gradient';

const sortDataList = [
  {
    id: 1,
    name: 'ENTRY',
  },
  {
    id: 2,
    name: 'SPORTS',
  },
  {
    id: 3,
    name: 'PRIZE',
  },
  {
    id: 4,
    name: 'POOL',
  },
  {
    id: 4,
    name: '%WINNER',
  },
  {
    id: 4,
    name: 'EXTRA CHECK',
  },
];

const SingleIplCardTest = () => {
    return (
      
        // 1st code 
    // <AppSafeAreaView>
    //   <View style={styles.wrapperContainer}>
    //     <View style={styles.backgroundImageContainer}>
    //       <FastImage
    //         source={contextBgNew}
    //         style={styles.bgImage}
    //         resizeMode="cover"></FastImage>
    //     </View>
    //     <View>
    //       <View style={styles.swipperContainer}>
    //         <SingleCard
    //           IPL="IPL"
    //           firstTeamImg={MumbaiIndianImg}
    //           firstTeamName="Mumbai"
    //           shortName="MI"
    //           live="LIVE"
    //           opponentTeamName="Hyderabad"
    //           opponentShortName="SRH"
    //           opponentImg={OpponentTeamImg}
    //           totalTeam="2"
    //           totalContest="3"
    //         />
    //       </View>
    //     </View>
    //     <LinearGradient
    //       colors={['#172c66', '#172c66']}
    //       // start={{x: 0.0, y: 1.0}}
    //       // end={{x: 1.0, y: 1.0}}
    //       style={{
    //         // backgroundColor: 'transparent',
    //         marginTop: 80,
    //         // flex: 0.5,                               [CORRECT HAI YE ]
    //         flex: 0.1,
    //         display: 'flex',
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         paddingHorizontal: 3,
    //         paddingVertical: 3,
    //         borderRadius: 30,
    //         margin: 10,
    //         borderColor: '#5588c3',
    //         borderWidth: 2,
    //       }}>
    //       <TouchableOpacityView
    //         style={{
    //           height: '100%',
    //           width: '32.33%',
    //           backgroundColor: '#A67CFF',
    //           marginRight: '1%',
    //           marginLeft: 0,
    //           borderRadius: 30,
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //           borderWidth: 0,
    //           borderColor: '#00B4C3',
    //         }}>
    //         <LinearGradient
    //           colors={['#00B4C3', '#7B57D0']}
    //           start={{x: 0.0, y: 1.0}}
    //           end={{x: 1.0, y: 1.0}}
    //           style={{
    //             height: '100%',
    //             width: '100%',

    //             borderRadius: 30,
    //             display: 'flex',
    //             flexDirection: 'column',
    //             justifyContent: 'center',
    //           }}>
    //           <Text style={{textAlign: 'center'}}>Contest</Text>
    //         </LinearGradient>
    //       </TouchableOpacityView>

    //       <View
    //         style={{
    //           height: '100%',
    //           width: '32.33%',
    //           backgroundColor: '#172c66',
    //           marginRight: '1%',
    //           borderRadius: 30,
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //         }}>
    //         <Text style={{textAlign: 'center'}}>My Contest(2)</Text>
    //       </View>
    //       <View
    //         style={{
    //           height: '100%',
    //           width: '32.33%',
    //           backgroundColor: '#172c66',

    //           marginRight: '1%',
    //           padding: 4,
    //           borderRadius: 30,
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //         }}>
    //         <Text style={{textAlign: 'center'}}>My Team(3)</Text>
    //       </View>
    //     </LinearGradient>
    //     {/* MEGA CONTEST */}
    //     <View style={{flex: 1, backgroundColor: 'brown', padding: 10}}>
    //       <ScrollView>
    //         <View style={{backgroundColor: 'blue', marginTop: 10, flex: 4}}>
    //           <Text>Mega Context</Text>
    //           <ScrollView>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //                 marginTop: 10,
    //               }}>
    //               <View
    //                 style={{
    //                   backgroundColor: 'orange',
    //                   height: '100%',
    //                   borderRadius: 30,
    //                 }}>
    //                 <View
    //                   style={{
    //                     backgroundColor: 'red',
    //                     height: '100%',
    //                     width: '100%',
    //                     borderRadius: 30,
    //                     borderWidth: 1,
    //                     borderColor: 'white',
    //                     padding: 10,
    //                   }}>
    //                   {/* <Text style={{color: 'yellow', marginTop: 10}}>hellpo</Text> */}
    //                   <View
    //                     style={{
    //                       width: '100%',
    //                       height: '90%',
    //                       backgroundColor: 'grey',
    //                     }}></View>
    //                 </View>
    //                 <View
    //                   style={{
    //                     width: '100%',
    //                     height: '10%',
    //                     backgroundColor: 'yellow',
    //                     position: 'absolute',
    //                     bottom: 0,
    //                     // borderRadius: 20,
    //                     borderBottomLeftRadius: 4,
    //                     borderBottomRightRadius: 2,
    //                   }}></View>
    //               </View>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //           </ScrollView>
    //           {/* <Text style={{color: 'red', marginTop: 20}}>hellpo</Text> */}
    //         </View>

    //         {/* PRACTICE CONTEST */}
    //         <View style={{backgroundColor: 'blue', marginTop: 10, flex: 3}}>
    //           <Text>Practice Contest</Text>
    //           <ScrollView>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 // padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red'}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //           </ScrollView>
    //           {/* <Text style={{color: 'red', marginTop: 20}}>hellpo</Text> */}
    //         </View>
    //         {/* BUTTON */}

    //         <View style={{backgroundColor: 'blue', marginTop: 10, flex: 1}}>
    //           <Text>Button Container</Text>
    //           <ScrollView>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 // padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red'}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //           </ScrollView>
             
    //         </View>
    //       </ScrollView>
    //     </View>
    //   </View>
    //     </AppSafeAreaView>
        // 2nd code

    //      <AppSafeAreaView>
    //   <View style={styles.wrapperContainer}>
    //     <View style={styles.backgroundImageContainer}>
    //       <FastImage
    //         source={contextBgNew}
    //         style={styles.bgImage}
    //         resizeMode="cover"></FastImage>
    //     </View>
    //     <View>
    //       <View style={styles.swipperContainer}>
    //         <SingleCard
    //           IPL="IPL"
    //           firstTeamImg={MumbaiIndianImg}
    //           firstTeamName="Mumbai"
    //           shortName="MI"
    //           live="LIVE"
    //           opponentTeamName="Hyderabad"
    //           opponentShortName="SRH"
    //           opponentImg={OpponentTeamImg}
    //           totalTeam="2"
    //           totalContest="3"
    //         />
    //       </View>
    //     </View>
    //     <LinearGradient
    //       colors={['#172c66', '#172c66']}
    //       // start={{x: 0.0, y: 1.0}}
    //       // end={{x: 1.0, y: 1.0}}
    //       style={{
    //         // backgroundColor: 'transparent',
    //         marginTop: 80,
    //         // flex: 0.5,                               [CORRECT HAI YE ]
    //         flex: 0.1,
    //         display: 'flex',
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         paddingHorizontal: 3,
    //         paddingVertical: 3,
    //         borderRadius: 30,
    //         margin: 10,
    //         borderColor: '#5588c3',
    //         borderWidth: 2,
    //       }}>
    //       <TouchableOpacityView
    //         style={{
    //           height: '100%',
    //           width: '32.33%',
    //           backgroundColor: '#A67CFF',
    //           marginRight: '1%',
    //           marginLeft: 0,
    //           borderRadius: 30,
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //           borderWidth: 0,
    //           borderColor: '#00B4C3',
    //         }}>
    //         <LinearGradient
    //           colors={['#00B4C3', '#7B57D0']}
    //           start={{x: 0.0, y: 1.0}}
    //           end={{x: 1.0, y: 1.0}}
    //           style={{
    //             height: '100%',
    //             width: '100%',

    //             borderRadius: 30,
    //             display: 'flex',
    //             flexDirection: 'column',
    //             justifyContent: 'center',
    //           }}>
    //           <Text style={{textAlign: 'center'}}>Contest</Text>
    //         </LinearGradient>
    //       </TouchableOpacityView>

    //       <View
    //         style={{
    //           height: '100%',
    //           width: '32.33%',
    //           backgroundColor: '#172c66',
    //           marginRight: '1%',
    //           borderRadius: 30,
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //         }}>
    //         <Text style={{textAlign: 'center'}}>My Contest(2)</Text>
    //       </View>
    //       <View
    //         style={{
    //           height: '100%',
    //           width: '32.33%',
    //           backgroundColor: '#172c66',

    //           marginRight: '1%',
    //           padding: 4,
    //           borderRadius: 30,
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //         }}>
    //         <Text style={{textAlign: 'center'}}>My Team(3)</Text>
    //       </View>
    //     </LinearGradient>
    //     {/* MEGA CONTEST */}
    //     <View style={{flex: 1, backgroundColor: 'brown', padding: 10}}>
    //       <ScrollView>
    //         <View style={{backgroundColor: 'blue', marginTop: 10, flex: 4}}>
    //           <Text>Mega Context</Text>
    //           <ScrollView>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //                 marginTop: 10,
    //               }}>
    //               <View
    //                 style={{
    //                   backgroundColor: 'orange',
    //                   height: '100%',
    //                   borderRadius: 30,
    //                 }}>
    //                 <View
    //                   style={{
    //                     backgroundColor: 'red',
    //                     height: '100%',
    //                     width: '100%',
    //                     borderRadius: 30,
    //                     borderWidth: 1,
    //                     borderColor: 'white',
    //                     padding: 10,
    //                   }}>
    //                   {/* <Text style={{color: 'yellow', marginTop: 10}}>hellpo</Text> */}
    //                   <View
    //                     style={{
    //                       width: '100%',
    //                       height: '90%',
    //                       backgroundColor: 'grey',
    //                     }}></View>
    //                 </View>
    //                 <View
    //                   style={{
    //                     width: '100%',
    //                     height: '10%',
    //                     backgroundColor: 'yellow',
    //                     position: 'absolute',
    //                     bottom: 0,
    //                     // borderRadius: 20,
    //                     borderBottomLeftRadius: 4,
    //                     borderBottomRightRadius: 2,
    //                   }}></View>
    //               </View>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 200,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //           </ScrollView>
    //           {/* <Text style={{color: 'red', marginTop: 20}}>hellpo</Text> */}
    //         </View>

    //         {/* PRACTICE CONTEST */}
    //         <View style={{backgroundColor: 'blue', marginTop: 10, flex: 3}}>
    //           <Text>Practice Contest</Text>
    //           <ScrollView>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 // padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red'}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //           </ScrollView>
    //           {/* <Text style={{color: 'red', marginTop: 20}}>hellpo</Text> */}
    //         </View>
    //         {/* BUTTON */}

    //         <View style={{backgroundColor: 'blue', marginTop: 10, flex: 1}}>
    //           <Text>Button Container</Text>
    //           <ScrollView>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 // padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red'}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //             <View
    //               style={{
    //                 backgroundColor: 'green',
    //                 padding: 10,
    //                 height: 30,
    //                 marginBottom: 10,
    //               }}>
    //               <Text style={{color: 'red', marginTop: 20}}>hellpo</Text>
    //             </View>
    //           </ScrollView>
             
    //         </View>
    //       </ScrollView>
    //     </View>
    //   </View>
    //     </AppSafeAreaView>
  );
};

export default SingleIplCardTest;
