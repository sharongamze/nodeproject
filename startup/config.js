const config = require('config');
const express = require('express');

const appkey=config.get('appPrivateKey');

module.exports = function() {
    if (!appkey) {
    console.error('ERROR: appPrivateKey is not defined!');
    process.exit(1);
    }
  }



