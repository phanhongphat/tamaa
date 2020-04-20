/* eslint-disable no-multi-assign */
/** eslint-disable */
const nextRoutes = require('next-routes');

const routes = (module.exports = nextRoutes());

routes.add('/company-detail/:id', 'company-detail');
routes.add('/employee-details/:id', 'employee-details');
routes.add('/restaurants-detail/:id', 'restaurants-detail');
routes.add('/users-detail/:id', 'users-detail');
routes.add('/credits-affection-employee/:id', '/credits-affection-employee');
routes.add('/island/:id', 'island');

routes.add('/create-employee/:id', 'create-employee');
