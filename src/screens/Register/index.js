import {View, Keyboard} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {
  AppText,
  FORTEEN,
  POPPINS,
  RUSSO,
  THIRTY,
  TWELVE,
} from '../../common/AppText';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../libs/rootReducer';
import InputBox from '../../common/InputBox';
import PrimaryButton from '../../common/primaryButton';
import Checkbox from '../../common/CheckBox/CheckBox';
import {LOGIN_SCREEN} from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';
import CommonImageBackground from '../../common/commonImageBackground';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import {toastAlert, validateEmail, validateMobile} from '../../helper/utility';
import {userSignup} from '../../actions/authActions';
import {SpinnerSecond} from '../../common/SpinnerSecond';

const Register = ({route}) => {
  const refercode = route?.params?.refercode;
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [isSelected, setIsSelected] = useState(false);

  const colors = useSelector(() => {
    return state.theme.colors;
  });
  const isLoading = useSelector(() => {
    return state.auth.isLoading;
  });

  const onSubmit = () => {
    Keyboard.dismiss();
    if ((!validateEmail(email) && !validateMobile(email)) || !email) {
      toastAlert.showToastError(
        'Please provide a valid Email Address or Mobile Number',
      );
      return;
    } else if (!firstName) {
      toastAlert.showToastError('Please provide a valid First Name');
    } else if (!password) {
      toastAlert.showToastError('Please provide a valid Password');
    } else if (!isSelected) {
      toastAlert.showToastError(
        'Please read terms of service carefully before proceed',
      );
    } else {
      let data = {
        email_or_phone: email,
        first_name: firstName,
        last_name: lastName,
        username: email,
        password: password,
        device: 'mobile',
        refercode: refercode ?? '',
      };

      dispatch(userSignup(data));
    }
  };

  return (
    <AppSafeAreaView style={styles.container} hidden>
      <KeyBoardAware>
        <CommonImageBackground>
          <View style={styles.bottomContainer}>
            <AppText
              type={THIRTY}
              weight={RUSSO}
              style={styles.referral(colors)}>
              Register
            </AppText>
            <AppText
              type={FORTEEN}
              weight={POPPINS}
              style={styles.enter(colors)}>
              Enter your details for Register
            </AppText>

            <InputBox
              value={email}
              placeholder="example@gmail.com"
              labelStyle={styles.label}
              label="Email or Mobile Number"
              onChange={value => setEmail(value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InputBox
              value={firstName}
              placeholder="John"
              labelStyle={styles.inputContainer}
              label="First Name"
              onChange={value => setFirstName(value)}
            />
            <InputBox
              value={lastName}
              placeholder="Wick"
              labelStyle={styles.inputContainer}
              label="Last Name"
              onChange={value => setLastName(value)}
            />

            <InputBox
              value={password}
              placeholder="*************"
              labelStyle={styles.inputContainer}
              label="Password"
              onChange={value => setPassword(value)}
              secureTextEntry={true}
            />
            <View style={styles.checkboxContainer}>
              <Checkbox
                onPress={() => setIsSelected(!isSelected)}
                value={isSelected}
              />

              <AppText
                onPress={() => setIsSelected(!isSelected)}
                type={TWELVE}
                style={styles.policy(colors)}>
                I have read and agree to MyBattle11 Terms of Service and
                Privacy Policy.
              </AppText>
            </View>
            <PrimaryButton
              onPress={onSubmit}
              title="REGISTER"
              buttonStyle={styles.button}
            />
            <TouchableOpacityView
              onPress={() => NavigationService.navigate(LOGIN_SCREEN)}>
              <AppText
                type={FORTEEN}
                weight={POPPINS}
                style={styles.account(colors)}>
                Already have any account?{' '}
                <AppText
                  type={FORTEEN}
                  weight={POPPINS}
                  type={FORTEEN}
                  style={styles.register(colors)}>
                  Log In
                </AppText>
              </AppText>
            </TouchableOpacityView>
          </View>
        </CommonImageBackground>
      </KeyBoardAware>
      <SpinnerSecond loading={isLoading} />
    </AppSafeAreaView>
  );
};

export default Register;
