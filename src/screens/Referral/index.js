import {View} from 'react-native';
import React, {useState} from 'react';
import {AppText, FORTEEN, POPPINS, RUSSO, THIRTY} from '../../common/AppText';
import {useSelector} from 'react-redux';
import {RootState} from '../../libs/rootReducer';
import InputBox from '../../common/InputBox';
import PrimaryButton from '../../common/primaryButton';
import styles from './styles';
import {REGISTER_SCREEN} from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';
import CommonImageBackground from '../../common/commonImageBackground';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {toastAlert} from '../../helper/utility';

const Referral = () => {
  const [code, setCode] = useState('');

  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });

  const onSubmit = () => {
    if (!code)
      return toastAlert.showToastError('Please provide a valid referral code');
    NavigationService.navigate(REGISTER_SCREEN, {refercode: code});
  };
  return (
    <AppSafeAreaView style={styles.container} hidden>
      <CommonImageBackground>
        <View style={styles.bottomContainer}>
          <AppText type={THIRTY} weight={RUSSO} style={styles.referral(colors)}>
            Referral Code
          </AppText>
          <AppText type={FORTEEN} weight={POPPINS} style={styles.enter(colors)}>
            Enter referral code
          </AppText>
          <InputBox
            value={code}
            placeholder="JHBJHU582"
            labelStyle={styles.label}
            label="Referral code"
            onChange={value => setCode(value)}
          />
          <PrimaryButton
            title="SUBMIT"
            onPress={onSubmit}
            buttonStyle={styles.button}
          />
          <TouchableOpacityView
            onPress={() => NavigationService.navigate(REGISTER_SCREEN)}>
            <AppText
              type={FORTEEN}
              weight={POPPINS}
              style={styles.account(colors)}>
              Don’t have any account?{' '}
              <AppText
                type={FORTEEN}
                weight={POPPINS}
                style={styles.register(colors)}>
                Register
              </AppText>
            </AppText>
          </TouchableOpacityView>
        </View>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

export default Referral;
