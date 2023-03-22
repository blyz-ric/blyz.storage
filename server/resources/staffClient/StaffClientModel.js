/**
 * Data Model for StaffClient.
 *
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add properties to the
 * staffClientSchema below, the create and update controllers
 * will respect the updated model.
 *
 * NOTE: make sure to account for any model changes on the client
 */

const apiUtils = require('../../global/utils/api');
let mongoose = require('mongoose');
let ObjectId = mongoose.SchemaTypes.ObjectId;

// define staffClient schema
const staffClientSchema = mongoose.Schema({
  // default values from Yote CLI
  created:                  { type: Date, default: Date.now }
  , updated:                { type: Date, default: Date.now }

  // specific values for staffClient go below
  , createdBy:              { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  , staffId:                { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true }
  , status:                 { type: String, default: 'active' }
});

// staffClient instance methods go here
// staffClientSchema.methods.methodName = function() {};

// staffClient model static functions go here
// staffClientSchema.statics.staticFunctionName = function() {};
staffClientSchema.statics.getSchema = () => {
  logger.info('return default schema paths');
  let schema = {}
  staffClientSchema.eachPath((path, schemaType) => {
    // console.log(path, schemaType);
    schema[path] = schemaType;
  });
  return schema;
}

staffClientSchema.statics.getDefault = () => {
  logger.info('return default object based on schema');
  let defObj = {};
  staffClientSchema.eachPath((path, schemaType) => {
    defObj[path] = apiUtils.defaultValueFromSchema(schemaType);
  });
  return defObj;
}

const StaffClient = mongoose.model('StaffClient', staffClientSchema);

// staffClient model methods
function createDefaults() {
  StaffClient.find({}).exec(function(err, staffClients) {
    if(staffClients.length == 0) {
      StaffClient.create({
        createdBy: '641ab6097011b5a7ecaf2be7'
        , staffId: '641ac151c5eb60c0184d8c60'
      });
      logger.info("created initial staffClient defaults");
    }
  });
}

exports.createDefaults = createDefaults;
