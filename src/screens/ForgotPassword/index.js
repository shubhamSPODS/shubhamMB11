import {Keyboard, View} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {AppText, FORTEEN, POPPINS, RUSSO, THIRTY} from '../../common/AppText';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../libs/rootReducer';
import InputBox from '../../common/InputBox';
import PrimaryButton from '../../common/primaryButton';
import CommonImageBackground from '../../common/commonImageBackground';
import NavigationService from '../../navigation/NavigationService';
import {OTP_SCREEN} from '../../navigation/routes';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import {toastAlert, validateEmail, validateMobile} from '../../helper/utility';
import {forgotPassword} from '../../actions/authActions';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const colors = useSelector(() => {
    return state.theme.colors;
  });
  const isLoading = useSelector(() => {
    return state.auth.isLoading;
  });

  const onSubmit = () => {
    Keyboard.dismiss();
    if ((!validateEmail(userName) && !validateMobile(userName)) || !userName) {
      toastAlert.showToastError(
        'Please provide a valid Email Address or Mobile Number',
      );
      return;
    } else {
      let data = {
        email_or_phone: userName,
        resend: true,
      };
      dispatch(forgotPassword(data));
    }
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <CommonImageBackground>
        <View style={styles.bottomContainer}>
          <AppText type={THIRTY} weight={RUSSO} style={styles.referral(colors)}>
            Forgot Password!
          </AppText>
          <AppText type={FORTEEN} weight={POPPINS} style={styles.enter(colors)}>
            Enter your mail, we will send you a confirmation code
          </AppText>
          <InputBox
            value={userName}
            placeholder="example@gmail.com"
            labelStyle={styles.label}
            label="Email or Mobile Number"
            onChange={value => setUserName(value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <PrimaryButton
            onPress={() => onSubmit()}
            title="SUBMIT"
            buttonStyle={styles.button}
          />
        </View>
      </CommonImageBackground>
      <SpinnerSecond loading={isLoading} />
    </AppSafeAreaView>
  );
};

export default ForgotPassword;
