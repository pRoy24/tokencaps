## What is TokenPlex

TokenPlex is an express/node based framework to aggregate crypto-currency data from the web, normalize and cleanse it, 
and provide simple easy to digest endpoints.

It implements the [ccxt](https://github.com/ccxt/ccxt) public library and provides a load-balancer and query-server over 80 supported exchanges.

## Installation

```
npm install
npm start
```

To Create all tables 

```
GET /create/create-all-tables
``` 

To start cron job for querying coin ticker data

```
GET /cron/query-coin-list-table 
```

### Optional
For server side rendering of Graph data, you need to install [chartjs-node](https://github.com/vmpowerio/chartjs-node).
It requires canvas.js and cairo to be pre-installed in your system.

and then simply call this endpoint to start cron job for querying 24 hour data
and server side graph rendering.

```
GET /cron/query-daily-history-table
```

You are now running an API load balancer for serving crypto-currency data.

## HA Deployment
To run TokenPlex in a fault-tolerant manner, you should use a HA data cluster and run your API server behind a load balancer. Since NodeJS is essentially single-threaded, you should run the CRON proceess in a separate node/container so that normal requests do not get jammed up due to blocked aggregation queries.
You can use (YugaByte)[https://yugabyte.com] a polyglot database with unified CQL + Redis implemetation 
<img src="https://s3-us-west-2.amazonaws.com/images.tokenplex.io/tp_architecture.png"/>


## Hosted Solution

### User Interface Endpoint at https://tokenplex.io

#### Exchange View
This provides a snapshot view public API's of 79 exchanges. The API is implemented over the (https://ccxt.com)[ccxt] library.

<img src="https://s3-us-west-2.amazonaws.com/images.tokenplex.io/top_screens_1.png"/>

#### Token View

This provides a list and details view of 2000 coins. The details join public aggregator API's and provide a normalized view.
Data is refreshed every 10 seconds.
<img src="https://s3-us-west-2.amazonaws.com/images.tokenplex.io/top_screens_2.png"/>

#### Portfolio View

This provides a portfolio management screen. Currently only aggregate exchanges supported. More exchange support coming soon.

<img src="https://s3-us-west-2.amazonaws.com/images.tokenplex.io/top_screens_3.png"/>

### API Endpoint at https://api.tokenplex.io

Tokenplex API is a hosted implementation of this repository. It currently uses an RF-1 Yugabyte node as it's database.
API docs can be found [here](https://api.tokenplex.io/docs)

For production applications, it is recommended that you run your own hosted solution.


## How It Works

Ticker data is stored in a Redis Cache and is by default updated every 3 seconds.
History Data requests have a TTL depending on sample rate of the request.
For eg. minutely data table has a TTL of 30 seconds while daily sampled data tables have a TTL of 12 hours.
Exchange-Markets table has a TTL of 6 Seconds.
Coin-Detail tables have a TTL of 10 Seconds. 

TimeSeries metrics data and token details is stored in a CQL database and is updated
on last request with a TTL strategy of 120 seconds.

Additionally you can specify an S3 Image server location for server side rendering of graph images.

You can run your own load balancer and application server on top of this architecture.

## Supported Exchanges
<img src="https://s3-us-west-2.amazonaws.com/images.tokenplex.io/brand_ex.png"/>

