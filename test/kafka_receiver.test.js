import chai, { expect } from 'chai';
import asPromised from 'chai-as-promised';
import receiver from '../src/kafka_receiver';
import uuid from 'uuid';

chai.use(asPromised);

describe('kafka_receiver', function() {
  let exitCode = 0;

  after(() => {
    process.exit(exitCode);
  });

  var receiverContext = {
    config: {
      connection: {
        host: "zookeeper:2181",
      },
      // https://www.npmjs.com/package/kafka-node#producer
      producerOptions: {
        requireAcks: 1,
        ackTimeoutMs: 100,
        partitionerType: 2
      },
      topic: "test_out",
    },
    log: {
      debug(m){},
      log(){},
      warn(m){},
      error(m, o){},
    },
  };

  var f = receiver(receiverContext);

  describe('receiver()', function() {

    it('receiver factory should return a function', function(done) {
      expect(f).to.be.an.instanceof(Function);
      done();
    });

    it('receiver should return a promise', function(done) {
      var h = f({ test: `promise check` }, { });
      expect(h).to.be.an.instanceof(Promise);
      done();
    });
  });

  describe('messageReceived()', function() {
    const requestId = uuid.v4();

    it('receiver promise should resolve', function(done) {
      var h = f({ test: `Message created during testing: ${requestId}` }, { requestId });

      expect(h).to.be.fulfilled.and.notify(done);
    });
  });
});
