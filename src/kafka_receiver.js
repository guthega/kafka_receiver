import { Client, KafkaClient, Producer, KeyedMessage } from 'kafka-node';

const receiver = (receiverContext) => {
  const { config, log } = receiverContext;
  const { connection, topic, producerOptions } = config;

  log.debug('Setting up Kafka receiver');

  const client = connection.kafkaHost ?
    new KafkaClient(connection) :
    new Client(
      connection.host,
      connection.id,
      connection.zk,
      connection.batch,
      connection.ssl,
    );

  const producer = new Producer(client, producerOptions);
  producer.on('error', err => log.error('Kafka producer error', { errorMessage: err.message, name: err.name }));

  let producerReady = false;
  producer.on('ready', () => {
    producerReady = true;
  });

  return (message, messageContext) => new Promise((res, rej) => {
    const sendMessage = (msg, msgCtx) => {
      if (!msg) {
        rej(new Error('Message is null'));
        return;
      }
      log.debug(`Message: ${msg}`);
      const m = msgCtx && msgCtx.key ?
        new KeyedMessage(msgCtx.key, JSON.stringify(msg)) :
        JSON.stringify(msg);

      const payloads = [{
        topic,
        messages: [
          m,
        ],
      }];

      log.debug(payloads);
      try {
        producer.send(payloads, (err, data) => {
          if (err) {
            log.error(err);
            rej(err);
          } else {
            res(data);
          }
        });
      } catch (e) {
        log.error(e);
        rej(e);
      }
    };

    if (producerReady) {
      log.debug('Producer is ready. Sending message.');
      sendMessage(message, messageContext);
    } else {
      log.debug('Producer is not ready. Waiting for "ready" event.');
      producer.on('ready', () => {
        sendMessage(message, messageContext);
      });
    }
  });
};

export default receiver;
