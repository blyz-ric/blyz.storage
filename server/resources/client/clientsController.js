/**
 * Sever-side controllers for Client.
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add fields to the Client
 * model, the create and update controllers below will respect
 * the new schema.
 *
 * NOTE: HOWEVER, you still need to make sure to account for
 * any model changes on the client
 */

let Client = require('mongoose').model('Client');

exports.list = (req, res) => {
  /** return all list of clients */
  Client.find({}).exec((err, clients) => {
    if(err || !clients) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else {
      res.send({ success: true, clients: clients });
    }
  });
}

exports.listByValues = (req, res) => {
  /**
   * returns list of clients queried from the array of _id's passed in the query param
   *
   * NOTES:
   * node default max request headers + uri size is 80kb.
   */

  if(!req.query[req.params.refKey]) {
    // make sure the correct query params are included
    res.send({success: false, message: `Missing query param(s) specified by the ref: ${req.params.refKey}`});
  } else {
    Client.find({[req.params.refKey]: {$in: [].concat(req.query[req.params.refKey]) }}, (err, clients) => {
        if(err || !clients) {
          res.send({success: false, message: `Error querying for clients by ${[req.params.refKey]} list`, err});
        } else  {
          res.send({success: true, clients});
        }
    })
  }
}

exports.listByRefs = (req, res) => {
  /**
   * NOTE: This let's us query by ANY string or pointer key by passing in a refKey and refId
   */

   // build query
  let query = {
    [req.params.refKey]: req.params.refId === 'null' ? null : req.params.refId
  }
  // test for optional additional parameters
  const nextParams = req.params['0'];
  if(nextParams.split("/").length % 2 == 0) {
    // can't have length be uneven, throw error
    res.send({success: false, message: "Invalid parameter length"});
  } else {
    if(nextParams.length !== 0) {
      for(let i = 1; i < nextParams.split("/").length; i+= 2) {
        query[nextParams.split("/")[i]] = nextParams.split("/")[i+1] === 'null' ? null : nextParams.split("/")[i+1]
      }
    }
    Client.find(query, (err, clients) => {
      if(err || !clients) {
        res.send({success: false, message: `Error retrieving clients by ${req.params.refKey}: ${req.params.refId}`});
      } else {
        res.send({success: true, clients})
      }
    })
  }
}

exports.search = (req, res) => {
  // search by query parameters
  // NOTE: It's up to the front end to make sure the params match the model
  let mongoQuery = {};
  let page, per;

  for(key in req.query) {
    if(req.query.hasOwnProperty(key)) {
      if(key == "page") {
        page = parseInt(req.query.page);
      } else if(key == "per") {
        per = parseInt(req.query.per);
      } else {
        logger.debug("found search query param: " + key);
        mongoQuery[key] = req.query[key];
      }
    }
  }

  logger.info(mongoQuery);
  if(page || per) {
    page = page || 1;
    per = per || 20;
    Client.find(mongoQuery).skip((page-1)*per).limit(per).exec((err, clients) => {
      if(err || !clients) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({
          success: true
          , clients: clients
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    Client.find(mongoQuery).exec((err, clients) => {
      if(err || !clients) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, clients: clients });
      }
    });
  }
}

exports.getById = (req, res) => {
  logger.info('get client by id');
  Client.findById(req.params.id).exec((err, client) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if (!client) {
      logger.error("ERROR: Client not found.");
      res.send({ success: false, message: "Client not found." });
    } else {
      res.send({ success: true, client: client });
    }
  });
}

exports.getSchema = (req, res) => {
  /**
   * This is admin protected and useful for displaying REST api documentation
   */
  logger.info('get client full mongo schema object');
  res.send({success: true, schema: Client.getSchema()});
}


exports.getDefault = (req, res) => {
  /**
   * This is an open api call by default (see what I did there?) and is used to
   * return the default object back to the Create components on the client-side.
   */
  logger.info('get client default object');
  res.send({success: true, defaultObj: Client.getDefault()});
}

exports.create = async (req, res) => {
  const {name, description} = req.body;
  const client = new Client({name, description});
  client.save();

  res.send({ success: true, message: 'Created client' });
}

exports.update = async (req, res) => {
  const {name, description} = req.body;
  await Client.findById(req.params.id).update({name, description})

  res.send({ success: true, message: 'Updated client', client: { _id: req.params.id } });
}

exports.delete = (req, res) => {
  logger.warn("deleting client");
  Client.findById(req.params.id).remove((err) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else {
      res.send({ success: true, message: "Deleted client" });
    }
  });
}
