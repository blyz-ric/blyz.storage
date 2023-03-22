/**
 * CRUD API for Flow.
 *
 * NOTE:
 * to restrict routes to only logged in users, add "requireLogin()"
 * to restrict routes to only admin users, add "requireRole('admin')"
 */

var staff = require('./staffsController');

module.exports = function(router, requireLogin, requireRole) {

  // - Create
  router.post('/api/staffs'               , requireLogin(), staff.create); // must login by default

  // - Read
  router.get('/api/staffs'                , staff.list);
  router.get('/api/staffs/search'         , staff.search);
  router.get('/api/staffs/by-:refKey/:refId*'  , staff.listByRefs);
  router.get('/api/staffs/by-:refKey-list'    , staff.listByValues);
  router.get('/api/staffs/default'        , staff.getDefault);
  router.get('/api/staffs/schema'         , requireRole('admin'), staff.getSchema);
  router.get('/api/staffs/:id'            , staff.getById);

  // - Update
  router.put('/api/staffs/:id'            , requireLogin(), staff.update); // must login by default

  // - Delete
  router.delete('/api/staffs/:id'         , requireRole('admin'), staff.delete); // must be an 'admin' by default

}
