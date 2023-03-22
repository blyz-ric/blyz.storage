/**
 * Data Model for Staff.
 *
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add properties to the
 * staffSchema below, the create and update controllers
 * will respect the updated model.
 *
 * NOTE: make sure to account for any model changes on the client
 */

const apiUtils = require('../../global/utils/api');
let mongoose = require('mongoose');
let ObjectId = mongoose.SchemaTypes.ObjectId;

// define staff schema
const staffSchema = mongoose.Schema({
  // default values from Yote CLI
  created:                  { type: Date, default: Date.now }
  , updated:                { type: Date, default: Date.now }

  // specific values for staff go below
  , createdBy:              { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  , firmId:                 { type: mongoose.Schema.Types.ObjectId, ref: 'Firm', required: true }
  , userId:                 { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  , status:                 { type: String, default: 'active' }
  , owner:                  { type: Boolean, default: false }
});

// staff instance methods go here
// staffSchema.methods.methodName = function() {};

// staff model static functions go here
// staffSchema.statics.staticFunctionName = function() {};
staffSchema.statics.getSchema = () => {
  logger.info('return default schema paths');
  let schema = {}
  staffSchema.eachPath((path, schemaType) => {
    // console.log(path, schemaType);
    schema[path] = schemaType;
  });
  return schema;
}

staffSchema.statics.getDefault = () => {
  logger.info('return default object based on schema');
  let defObj = {};
  staffSchema.eachPath((path, schemaType) => {
    defObj[path] = apiUtils.defaultValueFromSchema(schemaType);
  });
  return defObj;
}

const Staff = mongoose.model('Staff', staffSchema);

// staff model methods
function createDefaults() {
  Staff.find({}).exec(function(err, staffs) {
    if(staffs.length == 0) {
      Staff.create({
        createdBy: '641ab6097011b5a7ecaf2be7'
        , firmId: '641abb9397437db364927c03'
        , userId: '641ab6097011b5a7ecaf2be7'
        , owner: true
      });
      logger.info("created initial staff defaults");
    }
  });
}

exports.createDefaults = createDefaults;
