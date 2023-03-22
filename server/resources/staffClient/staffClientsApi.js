/**
 * CRUD API for Flow.
 *
 * NOTE:
 * to restrict routes to only logged in users, add "requireLogin()"
 * to restrict routes to only admin users, add "requireRole('admin')"
 */

var staffClient = require('./staffClientsController');

module.exports = function(router, requireLogin, requireRole) {

  // - Create
  router.post('/api/staff-clients'               , requireLogin(), staffClient.create); // must login by default

  // - Read
  router.get('/api/staff-clients'                , staffClient.list);
  router.get('/api/staff-clients/search'         , staffClient.search);
  router.get('/api/staff-clients/by-:refKey/:refId*'  , staffClient.listByRefs);
  router.get('/api/staff-clients/by-:refKey-list'    , staffClient.listByValues);
  router.get('/api/staff-clients/default'        , staffClient.getDefault);
  router.get('/api/staff-clients/schema'         , requireRole('admin'), staffClient.getSchema);
  router.get('/api/staff-clients/:id'            , staffClient.getById);

  // - Update
  router.put('/api/staff-clients/:id'            , requireLogin(), staffClient.update); // must login by default

  // - Delete
  router.delete('/api/staff-clients/:id'         , requireRole('admin'), staffClient.delete); // must be an 'admin' by default

}
