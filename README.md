

## What is TokenPlex

TokenPlex is a framework for running a data aggregator server 
for digital currency trades and transactions.

It aggregates data from exchanges and other aggregators, normalizes and cleans the data and provides 
simple easy to digest endpoints.

You can use it as a middleware server for an application/service involving digital currencies.

For an example of the kind of stuff you can do visit https://tokenplex.io/token/ETH/home.

<img src="https://lh3.googleusercontent.com/FUinxX7di3izoyPTFAwWdYIU9Tl8I5_bnFUZdYGAbIbqkItpIPTHNND0eHaMQSQJA2XU3JWFCkRU_H13xE2otftJ8nYbnb_jJotdeXSCnscewHF6Hf0FfxSOe-emlyBRacFBKM7F9gthbz3dhaxzoiDFT5A6u3GTXFr31K_1OdtGmCO_iXys8hhGQ4W0jzIsrh-Ix_y3crat2cV8pM5UMnPR8tB9BZEizsuALwpUPyQ_DPGBH3uvjbeqDCJ94PcxWN604xSvmytmiPKz5cYS4B5512MvEQHpga8XRMQRRqsXtD-eVJ1madDdOTm8he0V13LmH_z-rS8uaw2XCtxABYQHEs2NXoWTRmyCxMmPOKrK4ti92EPlWSmn2z5dVdt1smJnZJfjK7dIpIxigU3nBoBlyhL3s01-Kc_MfVQ5Awd7w-GMHqtLYEj4_s3cB2p38tcWN0WDPXNme3rOyIlzoMPIDSkAItKIT8QEbZtK98bJIkMVEQIzvvwf79__mA_8Jn7jCdqdqO_mj9ZnuDQKlVM9padQl28MKL6kiSGRRzftTuVQs97_RAEkeL2DrDDn3OJnUNSLY2dQwKalUaHVvAUc6rTgjkDn5ft1I2nE0FYkgbisA84nldmRJAY4ce8r9IyCuuWedaFyP5oxJ25n2ACa7tDxNxmyI5U=w814-h872-no"/>

## Installation

#### Prerequisites
You need to have a running CQL installation for the time series data
and a Redis server for Ticker data.
You have several options to choose from.
TokenPlex uses YugaByte which is a unified CQL + Redis implementation.


```
npm install
npm start
```
To Create all tables 
```
GET /create/create-all-tables
``` 
Individual create table documentation can be found in 
```
GET /cron/query-coin-list-table 
```
Optionally for server side rendering of Graph data

```
GET /cron/query-daily-history-table
```

You are now serving an API load balancer for crypto-currency data.


To view the data


GET 

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
