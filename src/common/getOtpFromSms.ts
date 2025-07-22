import { NativeModules } from 'react-native';

const { SmsConsentModule } = NativeModules;

export const getOtpFromSms = async (): Promise<string | null> => {
  try {
    const message = await SmsConsentModule.startSmsUserConsent();
    // Extract OTP (4-6 digit code) from the message
    const match = message.match(/\d{4,6}/);
    return match ? match[0] : null;
  } catch (e) {
    // Handle error or user denial
    return null;
  }
}; 