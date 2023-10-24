const { isPossiblePhoneNumber, isValidPhoneNumber } = require('libphonenumber-js');

module.exports = (req, res, next) => {
  // $phone = strval($phone);
  console.log('Here------');
  let { phone } = req.body;
  if (req.headers['x-phone']) {
    phone = req.headers['x-phone'];
  }
  if (!phone.startsWith('234') && phone.startsWith('0')) {
    const tmpPhone = phone.slice(1);
    phone = '234' + tmpPhone;
  } else if (phone.startsWith('+234')) {
    console.log('Here------', phone);
    phone = phone.slice(1);
  } else if (!phone.startsWith('234') && !phone.startsWith('0')) {
    phone = '234' + phone;
  }
  if (isPossiblePhoneNumber(phone, 'NG') === true && isValidPhoneNumber(phone, 'NG') === true) {
    req.body.phone = phone;
    if (req.headers['x-phone']) {
      req.headers['x-phone'] = phone;
    }
    next();
  } else {
    return res.status(400).json({
      errors: [{ message: 'Phone number not valid' }],
    });
  }
//   next();
  //   const regex1 = /[+]{0,1}(234){1}(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|909|908|901|902|903|904|905|906|907|915|911|913){1}[0-9]{7}/;
  //   const regex2 = /[+]{0,1}(234){1}(7025|7026|7027|7028|7029){1}[0-9]{6}/;
  //   const regex3 = /(0701|0702|0703|0704|0705|0706|0707|0708|0709|0802|0803|0804|0805|0806|0807|0808|0809|0810|0811|0812|0813|0814|0815|0816|0817|0818|0819|0909|0908|0901|0902|0903|0904|0905|0906|0907|0915|0911|0913){1}[0-9]{7}/;
  //   const regex4 = /(07025|07026|07027|07028|07029){1}[0-9]{6}/;
  //   if (phone.match(regex1) || phone.match(regex2) || phone.match(regex3) || phone.match(regex4)) {
  //     // return phone;
  //
  //   }
  //   return -1;
};
