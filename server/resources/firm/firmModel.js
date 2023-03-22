/**
 * Data Model for Firm.
 *
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add properties to the
 * firmSchema below, the create and update controllers
 * will respect the updated model.
 *
 * NOTE: make sure to account for any model changes on the client
 */

const apiUtils = require('../../global/utils/api');
let mongoose = require('mongoose');
let ObjectId = mongoose.SchemaTypes.ObjectId;

// define firm schema
const firmSchema = mongoose.Schema({
  // default values from Yote CLI
  created:                  { type: Date, default: Date.now }
  , updated:                 { type: Date, default: Date.now }

  // specific values for firm go below
  , name:                   { type: String, required: '{PATH} is required!' }
  , status:                 { type: String, default: 'trialing' }
  , logo:                   { type: String, default: null }
});

// firm instance methods go here
// firmSchema.methods.methodName = function() {};

// firm model static functions go here
// firmSchema.statics.staticFunctionName = function() {};
firmSchema.statics.getSchema = () => {
  logger.info('return default schema paths');
  let schema = {}
  firmSchema.eachPath((path, schemaType) => {
    // console.log(path, schemaType);
    schema[path] = schemaType;
  });
  return schema;
}

firmSchema.statics.getDefault = () => {
  logger.info('return default object based on schema');
  let defObj = {};
  firmSchema.eachPath((path, schemaType) => {
    defObj[path] = apiUtils.defaultValueFromSchema(schemaType);
  });
  return defObj;
}

const Firm = mongoose.model('Firm', firmSchema);

// firm model methods
function createDefaults() {
  Firm.find({}).exec(function(err, firms) {
    if(firms.length == 0) {
      Firm.create({
        name: "BLYZ solution company"
      });
      logger.info("created initial firm defaults");
    }
  });
}

exports.createDefaults = createDefaults;
