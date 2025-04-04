import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, ScrollView, FlatList, RefreshControl} from 'react-native';
import {universalPaddingHorizontal} from '../theme/dimens';
import FastImage from "@d11/react-native-fast-image";
import {CurrentStar, downArrow} from '../helper/image';
import {
  AppText,
  WHITE,
  ELEVEN,
  NORMAL,
  TEN,
  THIRTEEN,
  TWELVE,
  BROWNYELLOW,
} from '../common/AppText';
import {TouchableOpacityView} from '../common/TouchableOpacityView';
import {useSelector} from 'react-redux';
import {colors} from '../theme/color';
import {BASE_URL} from '../helper/utility';

const ScoreCardDetails = ({item, length, index, setUpDown, updown}) => {
  const matchDetails = useSelector(state => state?.match?.contestData);
  const [random, setRandom] = useState(10);
  const Batsmanrender = ({item, index}) => {
    return (
      <>
        <View style={Styles.batsmanrender}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <AppText
                color={BROWNYELLOW}
                style={{opacity: 0.9}}
                type={ELEVEN}
                weight={NORMAL}>
                {item?.name}
              </AppText>
              {item?.batting == 'true' ? (
                <FastImage
                  style={{height: 6, width: 6}}
                  resizeMode="contain"
                  source={CurrentStar}
                  tintColor={colors.brownYellow}
                />
              ) : (
                <></>
              )}
            </View>
            <AppText style={{color: 'white', fontSize: 9}}>
              {item?.how_out}
            </AppText>
          </View>
          <AppText
            style={{flex: 0.3, textAlign: 'center'}}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.runs}
          </AppText>
          <AppText
            style={{flex: 0.3, textAlign: 'center', }}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.balls_faced}
          </AppText>
          <AppText
            style={{flex: 0.3, textAlign: 'center', }}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.fours}
          </AppText>
          <AppText
            style={{flex: 0.3, textAlign: 'center', }}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.sixes}
          </AppText>
          <AppText
            style={{flex: 0.3, textAlign: 'center', }}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.strike_rate}
          </AppText>
        </View>
        {index - 1 ? (
          <></>
        ) : (
          <View
            style={{
              height: 1,
              backgroundColor: '#00000020',
              marginHorizontal: 10,
            }}
          />
        )}
      </>
    );
  };
  const Bolwerrender = ({item, index}) => {
    return (
      <>
        <View style={Styles.batsmanrender}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <AppText
              style={{flex: 1, }}
              color={BROWNYELLOW}
              type={TWELVE}
              weight={NORMAL}>
              {item?.name}
            </AppText>
            {item?.bowling === true ? (
              <FastImage
                style={{height: 6, width: 6}}
                resizeMode="contain"
                source={CurrentStar}
              />
            ) : (
              <></>
            )}
          </View>
          <AppText
            style={{flex: 0.3, textAlign: 'center'}}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.overs}
          </AppText>
          <AppText
            style={{flex: 0.3, textAlign: 'center', }}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.maidens}
          </AppText>
          <AppText
            style={{flex: 0.3, textAlign: 'center', }}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.runs_conceded}
          </AppText>
          <AppText
            style={{flex: 0.3, textAlign: 'center', }}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.wickets}
          </AppText>
          <AppText
            style={{flex: 0.3, textAlign: 'center', }}
            type={TWELVE}
            weight={NORMAL}
            color={WHITE}>
            {item?.econ}
          </AppText>
        </View>
        {index - 1 ? (
          <></>
        ) : (
          <View
            style={{
              height: 1,
              backgroundColor: '#00000020',
              marginHorizontal: 10,
            }}
          />
        )}
      </>
    );
  };

  const yetToBatplayer = ({item}) => {
    return (
      <AppText
        color={WHITE}
        weight={NORMAL}
        numberOfLines={1}
        style={{fontSize: 13, }}>
        {item.name},{' '}
      </AppText>
    );
  };

  const dorpDown = i => {
    setUpDown(updown == i ? '' : i);
    setRandom(Math.random());
  };

  return (
    <View style={[Styles.container, {marginBottom: 12}]}>
      <TouchableOpacityView
        onPress={() => dorpDown(item?.name)}
        style={Styles.topView}>
        <View
          style={{
            flexDirection: length == 1 ? 'column' : 'row',
            alignItems: length == 1 ? null : 'center',
          }}>
          <AppText type={TWELVE} weight={NORMAL} color={WHITE}>
            {matchDetails?.Status === 'Live'
              ? item?.item?.name
              : item?.item?.name.trim().split(' ')[0]}
          </AppText>
          {length == 1 ? (
            <AppText type={THIRTEEN} weight={NORMAL} color={WHITE}>
              {item?.item?.scores_full}
            </AppText>
          ) : (
            <></>
          )}
        </View>
        {length == 1 ? (
          <View style={{flexDirection: 'row'}}>
            <View style={{alignItems: 'center'}}>
              <AppText
                style={{}}
                type={THIRTEEN}
                weight={NORMAL}
                color={WHITE}>
                CRR
              </AppText>
              <AppText
                style={{}}
                type={THIRTEEN}
                weight={NORMAL}
                color={WHITE}>
                {item?.item?.equations?.runrate}
              </AppText>
            </View>
            <TouchableOpacityView
              onPress={() => dorpDown(item?.item?.name)}
              style={{
                padding: 5,
              }}>
              <FastImage
                style={[
                  Styles.downArrow,
                  {
                    transform: [
                      {
                        rotate: `${updown == item?.item?.name ? `180deg` : `0deg`}`,
                      },
                    ],
                  },
                ]}
                resizeMode="contain"
                source={downArrow}
                tintColor={colors.white}
              />
            </TouchableOpacityView>
          </View>
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AppText
              style={{
                marginRight: 10,
              }}
              type={THIRTEEN}
              weight={NORMAL}
              color={WHITE}>
              {item?.item?.scores_full || ''}
            </AppText>
            <TouchableOpacityView
              onPress={() => dorpDown(item?.item?.name)}
              style={{
                padding: 5,
              }}>
              <FastImage
                style={[
                  Styles.downArrow,
                  {
                    transform: [
                      {
                        rotate: `${updown == item?.item?.name ? `180deg` : `0deg`}`,
                      },
                    ],
                  },
                ]}
                resizeMode="contain"
                source={downArrow}
                tintColor={colors.white}
              />
            </TouchableOpacityView>
          </View>
        )}
      </TouchableOpacityView>
      {item?.item?.name == updown ? (
        <>
          <View style={Styles.batsmanView}>
            <AppText
              style={{flex: 1}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              Batsman
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              R
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              B
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              4s
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              6s
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              SR
            </AppText>
          </View>
          {item?.item?.batsmen?.map(item => {
            return <Batsmanrender item={item} />;
          })}
          {length == 1 ? (
            <View style={Styles.totalView}>
              <AppText color={WHITE} weight={NORMAL} style={{fontSize: 13}}>
                Total
              </AppText>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AppText
                  style={{
                    marginRight: 10,
                  }}
                  type={THIRTEEN}
                  weight={NORMAL}
                  color={WHITE}>
                  {item?.item?.scores_full == undefined
                    ? ''
                    : item?.item?.scores_full || item?.item?.scores_full}
                </AppText>
                <AppText
                  style={{
                    marginRight: 10,
                  }}
                  type={THIRTEEN}
                  weight={NORMAL}
                  color={WHITE}>
                  CRR {item?.item?.equations?.runrate}
                </AppText>
              </View>
            </View>
          ) : (
            <></>
          )}
          <View
            style={{
              height: 1,
              backgroundColor: '#00000020',
              marginHorizontal: 10,
            }}
          />
          {item?.item?.did_not_bat?.length ? (
            <View style={Styles.yetbat}>
              <AppText color={WHITE} weight={NORMAL} style={{fontSize: 13}}>
                Yet to bat
              </AppText>

              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                <FlatList
                  data={item?.did_not_bat}
                  renderItem={yetToBatplayer}
                  keyExtractor={(item, index) => {
                    index.toString();
                  }}
                  numColumns={4}
                />
              </ScrollView>
            </View>
          ) : (
            <></>
          )}
          <View style={Styles.bolwerView}>
            <AppText
              style={{flex: 1}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              Bowler
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              O
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              M
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              R
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              W
            </AppText>
            <AppText
              style={{flex: 0.3, textAlign: 'center'}}
              type={TWELVE}
              weight={NORMAL}
              color={WHITE}>
              ER
            </AppText>
          </View>
          {item?.item?.bowlers?.map(item => {
            return <Bolwerrender item={item} />;
          })}
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

const ScoreCard =({route}) => {
  const wsRefTwo = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [ForConnectedTo, setForConnectedTo] = useState(false);
  const [scoreBoard, setScoreBoard] = useState([]);
  const [updown, setUpDown] = useState('');
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  let url = `ws://app.mybattle11.com/leader-board?limit=10&skip=0&matchid=${route?.route?.params?.matchDetails?.MatchId}&contest_category_id=${route?.route?.params?.details?.contest_category_id}&user_id=${userData?._id}`;
  let urlTwo = `ws://app.mybattle11.com/leader-board?limit=10&skip=0&matchid=${route?.route?.params?.matchDetails?.MatchId}&contest_category_id=${route?.route?.params?.details?.contest_category_id}&user_id=${userData?._id}`;
  useEffect(() => {
    if (
      route?.route?.params?.matchDetails?.MatchId &&
      route?.route?.params?.details?.contest_category_id
    ) {
      wsRefTwo.current = new WebSocket(urlTwo);
      wsRefTwo.current.onopen = () => {
        console.log('connected');
      };
      wsRefTwo.current.onclose = e => {
        console.log('Connection Failed Plz Check Your Network', e);
        wsRefTwo.current = new WebSocket(urlTwo);
      };
      wsRefTwo.current.onerror = e => {
        console.log('Something Went Wrong', e);
        wsRefTwo.current = new WebSocket(urlTwo);
      };
      return () => {
        wsRefTwo.current.close();
      };
    }
  }, [route?.route?.params?.matchDetails?.MatchId]);
  const getData = React.useCallback(() => {
    if (isConnected && wsRefTwo.current) {
      wsRefTwo.current.close();
      setIsConnected(false);
    }
    try {
      wsRefTwo.current = new WebSocket(urlTwo);
      wsRefTwo.current.onopen = () => {
        setIsConnected(true);
      };
      if (!wsRefTwo.current) return;
      wsRefTwo.current.onmessage = e => {
        const parseData = JSON.parse(e?.data);
        setScoreBoard(parseData?.score);
      };
    } catch (error) {
    } finally {
    }
  }, [isConnected]);
  const reconnectWebSocket = () => {
    if (wsRefTwo.current && wsRefTwo.current.readyState !== WebSocket.OPEN) {
      wsRefTwo.current = new WebSocket(url);
      wsRefTwo.current.onopen = () => {};
      wsRefTwo.current.onclose = e => {
        reconnectWebSocket();
      };
      wsRefTwo.current.onerror = e => {
        reconnectWebSocket();
      };
      wsRefTwo.current.onmessage = e => {
        const parseData = JSON.parse(e?.data);
        setScoreBoard(parseData?.score);
      };
    }
  };
  useEffect(() => {
    if (!ForConnectedTo) {
      getData();
      setForConnectedTo(true);
    } else {
      const interval = setInterval(() => {
        getData();
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  const length = scoreBoard && scoreBoard[0]?.innings?.length;
  const onRefresh = type => {
    reconnectWebSocket();
  };


  return (
    <FlatList
      data={scoreBoard && scoreBoard[0]?.innings}
      renderItem={(item, index) => <ScoreCardDetails length={length} item={item} updown={updown} setUpDown={setUpDown}/>}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{marginTop: 10}}
      refreshControl={       






        
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    />
  );
}

  

export {ScoreCard};
const Styles = StyleSheet.create({
  container: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.playerDetailsLinerOne,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  topView: {
    paddingHorizontal: universalPaddingHorizontal,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamLogo: {
    height: 36,
    width: 29,
  },
  downArrow: {
    height: 24,
    width: 24,
  },
  batsmanView: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: colors.borderBackColor,
    borderBottomWidth: 1,
    borderColor: colors.borderGry,
    flexDirection: 'row',
    alignItems: 'center',
  },
  batsmanrender: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  yetbat: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bolwerView: {
    backgroundColor: colors.borderBackColor,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
