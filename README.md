# @guthega/kafka_receiver

[![NPM version](https://img.shields.io/npm/v/@guthega/kafka_receiver.svg)](https://www.npmjs.org/package/@guthega/kafka_receiver)
[![Build Status](https://travis-ci.org/guthega/kafka_receiver.svg?branch=master)](https://travis-ci.org/guthega/kafka_receiver)

Kafka receiver module for Guthega.

This module routes the inbound message to a Kafka topic.

## Usage

Refer to documentation in the [Guthega repo](https://github.com/guthega) for notes on how to use this receiver module.

## Configuration

The object passed to the handler's factory method expects the following properties to be present in the receiver's config:

* `connection` - Kafka client connection properties. Supports connecting via zookeeper and direct-to-Kafka. See **Client Connections** below for more information.
* `topics` - an array of topics that the message/s should be routed to.
* `producerOptions` - the Elasticsearch client connection properties for writing documents. This module makes use of the official Elasticsearch Client for Javascript. Please refer to the [client connection options](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/configuration.html#config-options) for information on which entries under `properties` are available and should be set.

## Client Connections

Depending on your implementation requirements, this module supports publishing messages to Kafka with and without the use of Zookeeper.

To connect to Kafka directly, set `kafkaHost` in your connection settings:

```
  "properties": {
    "connection": {
      "kafkaHost": "kafka:9092"
    },
    "topic": "test"
  }
```

Otherwise, to use Zookeeper:

```
  ...
  "properties": {
    "connection": {
      "host": "zookeeper:2181"
    },
    "topic": "test"
  }
  ...
```

For more information on specific properties that you can set based on your connection mode, please refer to the [kafka-node client API](https://github.com/SOHU-Co/kafka-node#api) documentation.

## Validating Message Receipt Handling

On a machine or inside a container that has access to the Kafka CLI tools:

```
kafka-console-consumer --zookeeper zookeeper:2181 --topic test_out
```
