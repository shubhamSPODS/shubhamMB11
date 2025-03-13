import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import { navigationRef } from '../App';
// import { NavigationNotification } from './src/Navigation/NavigationNotification';

export function navigate(name, params) {
  // console.log('=====',name,params,'========');
  setTimeout(() => {
    navigationRef?.current?.navigate(name, params);
  }, 2000);
}

export const notificationOpen = notification => {
  const Match = JSON.parse(notification?.data?.response_data).user_id;
  console.log(Match, '----Notification');
  console.log('navigationRef.type::::>>', notification?.id);
  console.log('notification.notification::::', notification.data);
  if (JSON.parse(notification?.data?.response_data).type == 'post_closed') {
    navigate('Group', {
      screen: 'MyPost',
    });
  } else if (
    JSON.parse(notification?.data?.response_data).type == 'match_found'
  ) {
    // navigate('Group', {
    //   screen: 'ContactDetails',
    //   ID: Match
    // });

    navigate('Group', {
      screen: 'ContactDetails',
      params: {userID: Match},
    });
  }
  // else if (JSON.parse(notification?.data?.response_data).type == 'post_deleted') {
  //   navigate('Group', {
  //     screen: 'MyPost',
  //   });
  // }
  else if (
    JSON.parse(notification?.data?.response_data).type == 'post_created'
  ) {
    navigate('Group', {
      screen: 'MyPost',
    });
  }

  // NavigationNotification()
  //   let notifyData = Platform.OS=='ios'?notify?.data:notify?.data?.response_data;
  //   if(notifyData){
  //     setTimeout(() => {
  //       let data = notifyData;
  //       if(data?.job_number){
  //       navigate('BookingDetails',{job_id: data.job_number});
  //       }
  //   },2000);
  // }
};