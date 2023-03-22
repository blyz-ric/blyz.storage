/**
 * CRUD API for Flow.
 *
 * NOTE:
 * to restrict routes to only logged in users, add "requireLogin()"
 * to restrict routes to only admin users, add "requireRole('admin')"
 */

var firm = require('./firmsController');

module.exports = function(router, requireLogin, requireRole) {

  // - Create
  router.post('/api/firms'               , requireLogin(), firm.create); // must login by default

  // - Read
  router.get('/api/firms'                , firm.list);
  router.get('/api/firms/search'         , firm.search);
  router.get('/api/firms/by-:refKey/:refId*'  , firm.listByRefs);
  router.get('/api/firms/by-:refKey-list'    , firm.listByValues);
  router.get('/api/firms/default'        , firm.getDefault);
  router.get('/api/firms/schema'         , requireRole('admin'), firm.getSchema);
  router.get('/api/firms/:id'            , firm.getById);

  // - Update
  router.put('/api/firms/:id'            , requireLogin(), firm.update); // must login by default

  // - Delete
  router.delete('/api/firms/:id'         , requireRole('admin'), firm.delete); // must be an 'admin' by default

}
