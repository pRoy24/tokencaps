// pRoy24 TokenPlex

var express = require('express')
  , router = express.Router()
  , User = require('./UserRoutes');


router.route('/register-user').post(User.registerUser);

router.route('/login-user').post(User.loginUser);

router.route('/authenticate-user').post(User.authenticateUser);

router.route('/list-coin').get(User.listCoins);

router.route('/add-user-transaction').post(User.addUserTransaction);


router.route('/get-all-users').get(User.listUsers);

router.route('/validate-user-name').get(User.validateUserName);

router.route('/delete-coin').delete(User.deleteCoin);

module.exports = router;