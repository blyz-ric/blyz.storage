/**
 * CRUD API for Flow.
 *
 * NOTE:
 * to restrict routes to only logged in users, add "requireLogin()"
 * to restrict routes to only admin users, add "requireRole('admin')"
 */

var example = require('./examplesController');

module.exports = function(router, requireLogin, requireRole) {

  // - Create
  router.post('/api/example'               , requireLogin(), example.create); // must login by default

  // - Read
  router.get('/api/example'                , example.list);
  router.get('/api/example/search'         , example.search);
  router.get('/api/example/by-:refKey/:refId*'  , example.listByRefs);
  router.get('/api/example/by-:refKey-list'    , example.listByValues);
  router.get('/api/example/default'        , example.getDefault);
  router.get('/api/example/schema'         , requireRole('admin'), example.getSchema);
  router.get('/api/example/:id'            , example.getById);

  // - Update
  router.put('/api/example/:id'            , requireLogin(), example.update); // must login by default

  // - Delete
  router.delete('/api/example/:id'         , requireRole('admin'), example.delete); // must be an 'admin' by default

}
