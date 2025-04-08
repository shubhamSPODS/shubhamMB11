import React from 'react';
import {Platform, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {RootState} from '../../libs/rootReducer';
import {AppSafeAreaViewProps} from '../../types/common';

const AppSafeAreaView = ({
  children,
  style,
  statusColor,
  hidden,
}: AppSafeAreaViewProps) => {
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
 
  return Platform.OS === 'ios' ? (
    <View style={[{flex: 1,backgroundColor:"black"}, style]}>
      <SafeAreaView
        edges={['right', 'left']}
        style={{
          flex: 1,
          
        }}>
        {children}
      </SafeAreaView>
    </View>
  ) : (
    <View style={[{flex: 1, backgroundColor:'black'}, style]}>
      <StatusBar
        translucent={false}
        backgroundColor={statusColor ? 'black' : "black"}
        barStyle={"light-content"}
        hidden={hidden}
      />
      {children}
    </View>
  );
};

export {AppSafeAreaView};
