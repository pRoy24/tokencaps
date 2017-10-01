
var express = require('express')
  , router = express.Router()
  , CreateTable = require('./CreateTable');

router.route('/create-coin-list-table').get(CreateTable.createCoinListTable)

router.route('/create-day-history-table').get(CreateTable.createDayHistoryTable)

router.route('/create-coin-snapshot-table').get(CreateTable.createCoinSnapshotTable)

router.route('/create-week-history-table').get(CreateTable.createCoinWeekHistoryTable)

router.route('/create-exchange-table').get(CreateTable.createExchangeTable)

module.exports = router;