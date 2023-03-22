/**
 * Sever-side controllers for Firm.
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add fields to the Firm
 * model, the create and update controllers below will respect
 * the new schema.
 *
 * NOTE: HOWEVER, you still need to make sure to account for
 * any model changes on the client
 */

let Firm = require('mongoose').model('Firm');

exports.list = (req, res) => {
  /** return all list of firms */
  Firm.find({ status: { $ne: 'cancelled' } }).exec((err, firms) => {
    if(err || !firms) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else {
      res.send({ success: true, firms: firms });
    }
  });
}

exports.listByValues = (req, res) => {
  /**
   * returns list of firms queried from the array of _id's passed in the query param
   *
   * NOTES:
   * node default max request headers + uri size is 80kb.
   */

  if(!req.query[req.params.refKey]) {
    // make sure the correct query params are included
    res.send({success: false, message: `Missing query param(s) specified by the ref: ${req.params.refKey}`});
  } else {
    Firm.find({[req.params.refKey]: {$in: [].concat(req.query[req.params.refKey]) }}, (err, firms) => {
        if(err || !firms) {
          res.send({success: false, message: `Error querying for firms by ${[req.params.refKey]} list`, err});
        } else  {
          res.send({success: true, firms});
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
    Firm.find(query, (err, firms) => {
      if(err || !firms) {
        res.send({success: false, message: `Error retrieving firms by ${req.params.refKey}: ${req.params.refId}`});
      } else {
        res.send({success: true, firms})
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
    Firm.find(mongoQuery).skip((page-1)*per).limit(per).exec((err, firms) => {
      if(err || !firms) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({
          success: true
          , firms: firms
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    Firm.find(mongoQuery).exec((err, firms) => {
      if(err || !firms) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, firms: firms });
      }
    });
  }
}

exports.getById = (req, res) => {
  logger.info('get firm by id');
  Firm.findById(req.params.id).exec((err, firm) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if (!firm) {
      logger.error("ERROR: Firm not found.");
      res.send({ success: false, message: "Firm not found." });
    } else {
      res.send({ success: true, firm: firm });
    }
  });
}

exports.getSchema = (req, res) => {
  /**
   * This is admin protected and useful for displaying REST api documentation
   */
  logger.info('get firm full mongo schema object');
  res.send({success: true, schema: Firm.getSchema()});
}


exports.getDefault = (req, res) => {
  /**
   * This is an open api call by default (see what I did there?) and is used to
   * return the default object back to the Create components on the client-side.
   */
  logger.info('get firm default object');
  res.send({success: true, defaultObj: Firm.getDefault()});
}

exports.create = async (req, res) => {
  const {name, description} = req.body;
  const firm = new Firm({name, description});
  firm.save();

  res.send({ success: true, message: 'Created firm' });
}

exports.update = async (req, res) => {
  const {name, description} = req.body;
  await Firm.findById(req.params.id).update({name, description})

  res.send({ success: true, message: 'Updated firm', firm: { _id: req.params.id } });
}

exports.delete = (req, res) => {
  logger.warn("deleting firm");
  Firm.findById(req.params.id).remove((err) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else {
      res.send({ success: true, message: "Deleted firm" });
    }
  });
}
