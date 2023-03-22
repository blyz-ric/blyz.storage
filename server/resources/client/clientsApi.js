/**
 * CRUD API for Flow.
 *
 * NOTE:
 * to restrict routes to only logged in users, add "requireLogin()"
 * to restrict routes to only admin users, add "requireRole('admin')"
 */

var client = require('./clientsController');

module.exports = function(router, requireLogin, requireRole) {

  // - Create
  router.post('/api/clients'               , requireLogin(), client.create); // must login by default

  // - Read
  router.get('/api/clients'                , client.list);
  router.get('/api/clients/search'         , client.search);
  router.get('/api/clients/by-:refKey/:refId*'  , client.listByRefs);
  router.get('/api/clients/by-:refKey-list'    , client.listByValues);
  router.get('/api/clients/default'        , client.getDefault);
  router.get('/api/clients/schema'         , requireRole('admin'), client.getSchema);
  router.get('/api/clients/:id'            , client.getById);

  // - Update
  router.put('/api/clients/:id'            , requireLogin(), client.update); // must login by default

  // - Delete
  router.delete('/api/clients/:id'         , requireRole('admin'), client.delete); // must be an 'admin' by default

}
