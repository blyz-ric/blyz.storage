/**
 * Data Model for Client.
 *
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add properties to the
 * clientSchema below, the create and update controllers
 * will respect the updated model.
 *
 * NOTE: make sure to account for any model changes on the client
 */

const apiUtils = require('../../global/utils/api');
let mongoose = require('mongoose');
let ObjectId = mongoose.SchemaTypes.ObjectId;

// define client schema
const clientSchema = mongoose.Schema({
  // default values from Yote CLI
  created:                  { type: Date, default: Date.now }
  , updated:                { type: Date, default: Date.now }

  // specific values for client go below
  , createdBy:              { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  , firmId:                 { type: mongoose.Schema.Types.ObjectId, ref: 'Firm', required: true }
  , name:                   { type: String, required: true }
  , status:                 { type: String, default: 'visible' }
});

// client instance methods go here
// clientSchema.methods.methodName = function() {};

// client model static functions go here
// clientSchema.statics.staticFunctionName = function() {};
clientSchema.statics.getSchema = () => {
  logger.info('return default schema paths');
  let schema = {}
  clientSchema.eachPath((path, schemaType) => {
    // console.log(path, schemaType);
    schema[path] = schemaType;
  });
  return schema;
}

clientSchema.statics.getDefault = () => {
  logger.info('return default object based on schema');
  let defObj = {};
  clientSchema.eachPath((path, schemaType) => {
    defObj[path] = apiUtils.defaultValueFromSchema(schemaType);
  });
  return defObj;
}

const Client = mongoose.model('Client', clientSchema);

// client model methods
function createDefaults() {
  Client.find({}).exec(function(err, clients) {
    if(clients.length == 0) {
      Client.create({
        createdBy: '641ab6097011b5a7ecaf2be7'
        , firmId: '641abb9397437db364927c03'
        , name: 'test client'
      });
      logger.info("created initial client defaults");
    }
  });
}

exports.createDefaults = createDefaults;
