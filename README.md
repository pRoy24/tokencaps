
<img src="https://lh3.googleusercontent.com/g6lA4U8dAsipJfUxPSL7HJpN_DNnerxTrXDkuZMfoM0Na-kRs-9QWtdep7NjuJ3pVXInXBBOTQHJIwzHUrpuaQzX1XzscfXIRAHcZ5Z-RVZ2mm9gzEEYa5z67z_BZz_oiSRIguhy_dtNG7kNN0LUF6gmiusFA3TdJeiiaOm_cyl4unrDzJLs5_4dkQqh0uIoFrVcBdnKHhIFFz64HR7Ue-6kiwMzaJiJOcQSNmbszq6XbpG0ebtCKZrARuRFIGTJywW1lnqADGdtwCBT-7HOQc3faC03F5VQFx5kLUYsy5fHLz_jcrKNY-I3OcYP0RrII7_45dTQlYmz_nN_A5yTas-VQIWnDEvHcic9J69qdzmPlqLmrOUyAfQw1sjCmauJcIOYNhP6qtNKLoxn1JuXvrum1yZdfZP75xQs3XfjaXrb4nXUX3il4jVqQbEO2zxEx04ALzAWF6loxgAScrHK7H8NP2QWoA0awgFnuibxAyZfTzT6Qo_K2K2K_2T-O097RVX1w78o1jHnlyxAjr14zuUQ67aULfcBDOgK9-FyCRjGNdxC_ik6SbRcY-MHQchWNfiRrEmY7oumiVQG4aZm9l-jWyJWTOEokuSV2Dy7nvzkI49QxHoxDtACWkQkQwruBUx-fC8OCn1YeqBhOWpPOE67se5Hvwk45NM=w132-h156-no" width="40"/> APIv0.0.9

## What is TokenPlex
TokenPlex is a data aggregator for digital currency trades and transactions.

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

Give it CQL Compatible data host.
Some hosts are
http://cassandra.apache.org/
https://github.com/YugaByte

Give it a Redis Compatible data host.
Redis API compatible servers can be run on -
https://redis.io/
https://github.com/YugaByte

See the api documentation for information regarding the REST API's exposed.

# Using the hosted service

You can use the hosted service at https://api.tokenplex.io
Read the docs at https://api.tokenplex.io/docs

## Data Sources

Current API Aggregator is powered by

1. https://www.cryptocompare.com/api/ 

2. https://coinmarketcap.com/api/

Plan to support top 10 exchanges by volume is on the road-map. 