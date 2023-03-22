let mongoose = require('mongoose');
let User = require('./resources/user/UserModel');
let logger = global.logger;

module.exports = function(config) {
  mongoose.Promise = global.Promise; // mongoose internal Promise library depreciated; use native
  mongoose.connect(config.db, {
    useMongoClient: true,
  });
  var db = mongoose.connection;
  db.on('error', logger.error.bind(console, 'mongo connection error'));
  db.once('open', function callback() {
    logger.debug('mongo connection opened');
  });

  // any other initial model calls
  User.createDefaults();
  Example.createDefaults();
  Firm.createDefaults();
  Staff.createDefaults();
  Client.createDefaults();
};

// Yote models are defined below
let Example = require('./resources/example/ExampleModel');
let Firm = require('./resources/firm/FirmModel');
let Staff = require('./resources/staff/StaffModel');
let Client = require('./resources/client/ClientModel');