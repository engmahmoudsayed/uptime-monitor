
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');


const helpers = {};


helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};


helpers.parseJsonToObject = function(str){
  try{
    const obj = JSON.parse(str);
    return obj;
  }catch(e){
    return {};
  }
};

helpers.createRandomString = function(strLength) {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

 
    let str = '';
    for (i = 1; i <= strLength; i++) {
      
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      
      str+=randomCharacter
    }
   
    return str;

  } else {
    return false;
  }
};


helpers.sendTwilioSms = (phone, msg, callback) => {
  
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  if(phone && msg){
    
    const payload = {
      'From' : config.twilio.fromPhone,
      'To'   : '+1' + phone,
      'Body' : msg
    };

    // Stringify the payload
    const stringPayload = querystring.stringify(payload);

    // Configure the request details
    const requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method'   : 'POST',
      'path'     : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth'     : config.twilio.accountSid+':'+config.twilio.authToken,
      'headers'  : {
        'Content-Type'   : 'application/x-www-form-urlencoded',
        'Content-Length' : Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object
    const req = https.request(requestDetails, (res) => {
      const status = res.statusCode;
      // Callback successfully if the request went through
      if(status == 200 || status == 201){
        callback(false);
      } else {
        callback('Status code returned was '+status);
      }
    });

    req.on('error', (e) => {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    req.end();

  } else {
    callback('Necessary parameters ("phone" and "msg") were missing or invalid');
  }
}


module.exports = helpers;
