
var express = require('express')
  , router = express.Router()
  , CreateTable = require('./CreateTable');

router.route('/create-coin-list-table').get(CreateTable.createCoinListTable)

router.route('/create-coin-snapshot-table').get(CreateTable.createCoinSnapshotTable)

router.route('/create-week-history-table').get(CreateTable.createCoinWeekHistoryTable)

router.route('/create-all-time-history-table').get(CreateTable.createAllTimeHistoryTable)

router.route('/create-day-history-table').get(CreateTable.createDayHistoryTable)

router.route('/create-exchange-table').get(CreateTable.createExchangeTable)

router.route('/create-social-table').get(CreateTable.createCoinSocialTable)

module.exports = router;