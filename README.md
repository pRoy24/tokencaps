

## What is TokenPlex

TokenPlex is a framework for running a data aggregator server 
for digital currency trades and transactions.

You can easily run a middleware server for an application/service involving digital currency data.

For an example of the kind of stuff you can do visit https://tokenplex.io/token/ETH/home.

## Implementation

Web Front-End is hosted at https://tokenplex.io/

API Docs at https://api.tokenplex.io/docs

# How It Works

Ticker data is stored in a Redis Cache and is by default updated every 2 minutes.

Contains data on top 1000 coins by ranking at CoinMarketCap.

Graph data and token details is stored in a CQL Server and is updated on last request with a TTL 
strategy of 120 seconds.

Additionally you can specify an S3 Image server location for server side rendering of graph images.

You can run your own load balancer and application server on top of this architecture.

# Running a Local API Server

This project is essentially an ExpressJS middleware which 
you can use to run your own private aggregator service.

You can run this with any CQL and Redis API compatible server, we are big fans of
the [YugaByte](https://www.yugabyte.com) project which is compatible with both Redis and CQL API's
and allows you to easily run CQL and Redis services on the same set of nodes and easily perform scale-in
and scale-out operations.

### CQL Compatible data host.

Some CQL compatible hosts are

http://cassandra.apache.org/

https://github.com/YugaByte


### Redis API Compatible data host for ticker data.

Redis API compatible servers can be run on -

https://redis.io/

https://github.com/YugaByte


### Optional

S3 based Image server if you're interested in server side graph rendering.

See the api documentation for information regarding the REST API's exposed.

# Using the hosted service

You can use the hosted service at https://api.tokenplex.io
Read the docs at https://api.tokenplex.io/docs

## Data Sources

Current API Aggregator is powered by

1. https://www.cryptocompare.com/api/ 

2. https://coinmarketcap.com/api/

Plan to support top 10 exchanges by volume is on the road-map. 
