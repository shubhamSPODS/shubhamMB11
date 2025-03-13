import {Keyboard, View} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {AppText, FORTEEN, POPPINS, RUSSO, THIRTY} from '../../common/AppText';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../libs/rootReducer';
import InputBox from '../../common/InputBox';
import PrimaryButton from '../../common/primaryButton';
import CommonImageBackground from '../../common/commonImageBackground';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {toastAlert} from '../../helper/utility';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import {resetPassword} from '../../actions/authActions';

const ResetPassword = ({route}: any) => {
  const {data} = route?.params ?? '';

  const dispatch = useDispatch();
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  const isLoading = useSelector((state: RootState) => {
    return state.auth.isLoading;
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const onSubmit = () => {
    Keyboard.dismiss();
    if (newPassword.length < 6) {
      toastAlert.showToastError('Password must be at least 6 character long');
    } else if (newPassword != confirmPassword) {
      toastAlert.showToastError(
        'Confirm password does not match with new password!',
      );
    } else {
      data['new_password'] = newPassword;
      data['confirm_password'] = confirmPassword;
      dispatch(resetPassword(data));
    }
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <CommonImageBackground>
        <View style={styles.bottomContainer}>
          <AppText type={THIRTY} weight={RUSSO} style={styles.referral(colors)}>
            Reset Password
          </AppText>
          <AppText type={FORTEEN} weight={POPPINS} style={styles.enter(colors)}>
            Enter your new password
          </AppText>
          <InputBox
            placeholder="*********"
            labelStyle={styles.label}
            label="New Password"
            value={newPassword}
            onChange={value => setNewPassword(value)}
          />
          <InputBox
            placeholder="*********"
            labelStyle={styles.confirm}
            label="Confirm Password"
            value={confirmPassword}
            onChange={value => setConfirmPassword(value)}
          />

          <PrimaryButton
            title="SUBMIT"
            onPress={onSubmit}
            buttonStyle={styles.button}
          />
        </View>
      </CommonImageBackground>
      <SpinnerSecond loading={isLoading} />
    </AppSafeAreaView>
  );
};

export default ResetPassword;
