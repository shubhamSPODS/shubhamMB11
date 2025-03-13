import React from "react";
import { StyleSheet, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Screen } from "../theme/dimens";
import { AppText, BLACK, LIGHTBLUE, RED, SIXTEEN } from "./AppText";
import { colors } from "../theme/color";
import LinearGradient from "react-native-linear-gradient";
export const RenderTabBar = (props: any) => {
  return (
      <TabBar
        {...props}
        renderLabel={({ route, focused }) => (
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              height: 38,
              justifyContent: 'space-evenly',
              padding: 5,
              alignItems: 'center',
            }}>
            <AppText type={SIXTEEN} color={focused ? LIGHTBLUE : BLACK}>
              {route.title}
            </AppText>
            {focused ? 
            <LinearGradient
              style={{ height: 2, width: 102 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[
                colors.borderBackColor,
                colors.borderPick,
              ]}></LinearGradient> :<View style={{width:102, height:2}}></View>
            }
          </View>
        )}
        indicatorStyle={{ backgroundColor: 'transparent'}}
        scrollEnabled={!props.scrollEnabled ? props.scrollEnabled : true}
        tabStyle={[{ width: 'auto' }, props.tabStyle]}
        pressColor={'transparent'}
        style={[styles.tabbar, props.style]}
      />

  );
};

const SlideSwiper = ({ totalCount }: any) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Contest' },
    { key: 'second', title: `My Contest` },
    { key: 'three', title: `My Team` },
  ]);
  const renderScene = SceneMap({
    first: () => <AppText color={BLACK}>
      FIRST
    </AppText>,
    second: () => <AppText color={BLACK}>
      THIRE
    </AppText>,
    three: () => <AppText color={BLACK}>
      Three
    </AppText>
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Screen.Width }}
      renderTabBar={props => (
        <RenderTabBar
          {...props}
          style={{ marginHorizontal: 10 }}
        />
      )}
    />
  )
}
export default SlideSwiper
const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderBottomWidth: 0,
  },
  container: {
    height: 45,
    // top: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
{/* <TabView
navigationState={{ index, routes }}
renderScene={renderScene}
onIndexChange={setIndex}
initialLayout={{ width: Screen.Width }}
renderTabBar={props => (
  <RenderTabBar
    {...props}
    style={{ marginHorizontal: 10 }}
  />
)}
/> */}
// const renderScene = SceneMap({
//   first: () => contestView(),
//   second: () => MyContestView(),
//   three: () => MyTeamView()
// })