// pRoy24 tokenplex

var express = require('express')
  , router = express.Router()
  , CreateTable = require('./CreateTable');

router.route('/create-coin-list-table').get(CreateTable.createCoinListTable);

router.route('/create-coin-snapshot-table').get(CreateTable.createCoinSnapshotTable);

router.route('/create-week-history-table').get(CreateTable.createCoinWeekHistoryTable);

router.route('/create-all-time-history-table').get(CreateTable.createAllTimeHistoryTable);

router.route('/create-day-history-table').get(CreateTable.createDayHistoryTable);

router.route('/create-exchange-table').get(CreateTable.createExchangeTable);

router.route('/create-social-table').get(CreateTable.createCoinSocialTable);

/**
 * @api {get} /create/create-all-tables Create all coin tables
 * @apiName createAllTables
 * @apiGroup Create Table
 * @apiParam {String} App Secret
 * @apiSuccess {String} API request submitted message string.
 * @apiError {String} Server error String.
 */
router.route('/create-all-tables').get(CreateTable.createAllTables);

module.exports = router;