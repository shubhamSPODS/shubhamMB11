// import {AppOperation} from '../..';

import {GUEST_TYPE} from '../../types';

export default appOperation => ({
  login: data => appOperation.post('/user/signup', data, GUEST_TYPE),
  register: data => appOperation.post('send-otp', data, GUEST_TYPE),

  otp_verification: data => appOperation.post('user/signup', data, GUEST_TYPE),


  resend_otp: id =>
    appOperation.get(`user/signup/${id}`, undefined, undefined, GUEST_TYPE),
});
