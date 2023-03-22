/**
 * Data Model for Example.
 *
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add properties to the
 * exampleSchema below, the create and update controllers
 * will respect the updated model.
 *
 * NOTE: make sure to account for any model changes on the client
 */

const apiUtils = require('../../global/utils/api');
let mongoose = require('mongoose');
let ObjectId = mongoose.SchemaTypes.ObjectId;

// define example schema
const exampleSchema = mongoose.Schema({
  // default values from Yote CLI
  createdDate:                  { type: Date, default: Date.now }
  , updateDate:                 { type: Date, default: Date.now }

  // specific values for example go below
  , name:                   { type: String, required: '{PATH} is required!' }
  , description:            { type: String }
});

// example instance methods go here
// exampleSchema.methods.methodName = function() {};

// example model static functions go here
// exampleSchema.statics.staticFunctionName = function() {};
exampleSchema.statics.getSchema = () => {
  logger.info('return default schema paths');
  let schema = {}
  exampleSchema.eachPath((path, schemaType) => {
    // console.log(path, schemaType);
    schema[path] = schemaType;
  });
  return schema;
}

exampleSchema.statics.getDefault = () => {
  logger.info('return default object based on schema');
  let defObj = {};
  exampleSchema.eachPath((path, schemaType) => {
    defObj[path] = apiUtils.defaultValueFromSchema(schemaType);
  });
  return defObj;
}

const Example = mongoose.model('Example', exampleSchema);

// example model methods
function createDefaults() {
  Example.find({}).exec(function(err, examples) {
    if(examples.length == 0) {
      Example.create({
        name: "example test 1!"
        , description: "description test 1!"
      });
      logger.info("created initial example defaults");
    }
  });
}

exports.createDefaults = createDefaults;
