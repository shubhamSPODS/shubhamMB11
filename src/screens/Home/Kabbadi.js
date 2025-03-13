import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
  } from 'react-native';
  import React from 'react';
  import Card from './Card'
  import { TouchableOpacityView } from '../../common/TouchableOpacityView';
  import LinearGradient from 'react-native-linear-gradient';
  import {
    AppText,
    POPINS_THIN_ITALIC,
    POPPINS,
    POPPINS_MEDIUM,
    POPPINS_SEMI_BOLD,
    THIRTEEN,
    TWENTY_FOUR,
  } from '../../common/AppText';
  import NavigationService from '../../navigation/NavigationService';
  import {BOTTOM_TAB_CONTEST_SCREEN} from '../../navigation/routes';
  const Kabbadi = () => {
    const category = [
      {
        name: 'Football Premier League',
        image:
          'https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2021/10/virat-kohli-1-1634017162.jpg',
        title: 'Liverpool',
        main: 'Chelsea',
      },
      {
        name: 'Football Premier League',
        image:
          'https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2021/10/virat-kohli-1-1634017162.jpg',
        title: 'Liverpool',
        main: 'Chelsea',
      },
      {
        name: 'Football Premier League',
        image:
          'https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2021/10/virat-kohli-1-1634017162.jpg',
        title: 'Liverpool',
        main: 'Chelsea',
      },
      {
        name: 'Football Premier League',
        image:
          'https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2021/10/virat-kohli-1-1634017162.jpg',
        title: 'Liverpool',
        main: 'Chelsea',
      },
    ];
    const listDivider = () => {
      return <View style={{width: 10, height: 1}}></View>;
    };
    const customListView = rowdata => {
      return (
        <LinearGradient
          style={{
            height: 140,
            padding: 10,
            justifyContent: 'center',
            borderRadius: 16,
            alignItems: 'center',
            alignSelf: 'center',
            width: 190,
          }}
          start={{x: 0.8, y: 0}}
          end={{x: 0, y: 0}}
          colors={[
            'rgba(0, 138, 117, 1)',
            'rgba(6, 24, 40, 1)',
            'rgba(7, 22, 39, 1)',
            '  rgba(3, 70, 148, 1)',
          ]}>
          <View style={{width: '100%'}}>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 1)',
                fontSize: 10,
                fontWeight: '700',
                textAlign: 'center',
                fontFamily: 'POPPINS',
              }}>
              {rowdata.item.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                top: 10,
              }}>
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 1)',
                  fontSize: 10,
                  fontWeight: '500',
                  textAlign: 'center',
                  fontFamily: 'POPPINS',
                }}>
                {rowdata.item.title}
              </Text>
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 1)',
                  fontSize: 10,
                  fontWeight: '500',
                  textAlign: 'center',
                  fontFamily: 'POPPINS',
                }}>
                {rowdata.item.main}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                top: 15,
              }}>
              <Image
                style={{
                  width: 53,
                  height: 48,
                  resizeMode: 'contain',
                }}
                source={require('../../../assets/images/1.png')}
              />
              <Text
                style={{
                  color: 'rgba(21, 206, 49, 1)',
                  fontWeight: '500',
                  fontSize: 10,
                }}>
                Live
              </Text>
              <Image
                style={{
                  width: 53,
                  height: 48,
                  resizeMode: 'contain',
                }}
                source={require('../../../assets/images/1.png')}
              />
            </View>
            <View
              style={{
                height: 22,
                justifyContent: 'space-around',
                backgroundColor: '#1F2A2C',
                flexDirection: 'row',
                alignItems: 'center',
                width: 190,
                top: 30,
                right: 10,
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 9,
                  fontWeight: '500',
                  fontFamily: 'POPPINS',
                  right: 10,
                }}>
                2 Team
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 9,
                  fontWeight: '500',
                  fontFamily: 'POPPINS',
                  left: 15,
                }}>
                3 Contests
              </Text>
            </View>
          </View>
        </LinearGradient>
      );
    };
    return (
      <ScrollView style={{marginTop: 30, height: 700}}>
      <View style={{}}>
      <AppText
          weight={POPPINS_SEMI_BOLD}
          type={TWENTY_FOUR}
          style={{
            textAlign: 'center',
          }}>
          Coming Soon
        </AppText>
      </View>
    </ScrollView>
    );
  };
  
  export default Kabbadi;
  