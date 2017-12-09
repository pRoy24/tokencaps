

## What is TokenPlex

TokenPlex is a framework that aggregates crypto-currency data from the web, normalizes and cleans it and provides 
simple easy to digest endpoints.

It can be used as a middleware server for an application/service involving digital currencies.

<img src="https://lh3.googleusercontent.com/FUinxX7di3izoyPTFAwWdYIU9Tl8I5_bnFUZdYGAbIbqkItpIPTHNND0eHaMQSQJA2XU3JWFCkRU_H13xE2otftJ8nYbnb_jJotdeXSCnscewHF6Hf0FfxSOe-emlyBRacFBKM7F9gthbz3dhaxzoiDFT5A6u3GTXFr31K_1OdtGmCO_iXys8hhGQ4W0jzIsrh-Ix_y3crat2cV8pM5UMnPR8tB9BZEizsuALwpUPyQ_DPGBH3uvjbeqDCJ94PcxWN604xSvmytmiPKz5cYS4B5512MvEQHpga8XRMQRRqsXtD-eVJ1madDdOTm8he0V13LmH_z-rS8uaw2XCtxABYQHEs2NXoWTRmyCxMmPOKrK4ti92EPlWSmn2z5dVdt1smJnZJfjK7dIpIxigU3nBoBlyhL3s01-Kc_MfVQ5Awd7w-GMHqtLYEj4_s3cB2p38tcWN0WDPXNme3rOyIlzoMPIDSkAItKIT8QEbZtK98bJIkMVEQIzvvwf79__mA_8Jn7jCdqdqO_mj9ZnuDQKlVM9padQl28MKL6kiSGRRzftTuVQs97_RAEkeL2DrDDn3OJnUNSLY2dQwKalUaHVvAUc6rTgjkDn5ft1I2nE0FYkgbisA84nldmRJAY4ce8r9IyCuuWedaFyP5oxJ25n2ACa7tDxNxmyI5U=w814-h872-no"/>

## Running a local middleware server 

#### Prerequisites
You need to have a running CQL installation for time-series data
and a Redis server for Ticker data.

You have several options to choose from.

TokenPlex uses YugaByte which is a unified CQL + Redis implementation.

For instructions on how to build YugaByte from source, visit 
https://github.com/YugaByte/yugabyte-db

To download and install binaries for your platform, visit
https://docs.yugabyte.com/quick-start/install/

#### Installation

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
routes/schema/index.js

```
To start cron job for querying coin ticker data

```
GET /cron/query-coin-list-table 
```

##### Optional
For server side rendering of Graph data, you need to install chartjs-node.
It requires canvas.js to be pre-installed in the system and 
also has a dependancy on chart.js.
Installation instructions for Cairo and Canvas for your plaform can be found
 [here](https://github.com/Automattic/node-canvas#installation)
 Create /public/image/charts directory in your project where charts will be stored.

```
npm install chart.js@2.6.0
npm install chartjs-node
```
and then simply call this endpoint to start cron job for querying 24 hour data
and server side graph rendering.

```
GET /cron/query-daily-history-table
```

You are now running an API load balancer for serving crypto-currency data.


## Using the hosted Implementation

Web Front-End is hosted at https://tokenplex.io/

API Endpoint is hosted at https://api.tokenplex.io

API Docs at https://api.tokenplex.io/docs

## How It Works

Ticker data is stored in a Redis Cache and is by default updated every 2 minutes.

TimeSeries metrics data and token details is stored in a CQL database and is updated
on last request with a TTL strategy of 120 seconds.

Additionally you can specify an S3 Image server location for server side rendering of graph images.

You can run your own load balancer and application server on top of this architecture.


## Optional

S3 based Image server if you're interested in server side graph rendering.

See the api documentation for information regarding the REST API's exposed.


## Data Sources

Current API Aggregator is powered by

1. https://www.cryptocompare.com/api/ 

2. https://coinmarketcap.com/api/

Plan to support top 10 exchanges by volume is on the road-map. 
