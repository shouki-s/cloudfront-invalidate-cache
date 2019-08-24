const AWS = require('aws-sdk');
const AWSmock = require('aws-sdk-mock');
const { invalidateCache } = require('./index');

beforeEach(() => {
  AWSmock.setSDKInstance(AWS);
});

afterEach(() => {
  AWSmock.restore();
});

describe(invalidateCache, () => {
  it('should return Promise<void>', () => {
    AWSmock.mock('CloudFront', 'listDistributions', (params, callback) => {
      callback(null, {
        DistributionList: {
          Items: [{ Id: 'MyId', Aliases: { Items: ['example.com'] } }],
        },
      });
    });
    AWSmock.mock('CloudFront', 'createInvalidation', (params, callback) => {
      callback(null, {});
    });
    return expect(invalidateCache('example.com')).resolves.toBeUndefined();
  });

  it('should list all distributions', async () => {
    let called = 0;
    AWSmock.mock('CloudFront', 'listDistributions', (params, callback) => {
      called++;
      callback(null, {
        DistributionList: {
          Items: [{ Id: 'MyId', Aliases: { Items: ['xxxxxxxxxx'] } }],
          NextMarker: params.Marker ? null : 'MARKER',
          IsTruncated: !params.Marker,
        },
      });
    });
    AWSmock.mock('CloudFront', 'createInvalidation', (params, callback) => {
      callback(null, {});
    });
    try {
      await invalidateCache('example.com');
    } catch (err) {
      /*ignore*/
    }
    expect(called).toBe(2);
  });

  it('should create invalidations for all matched distributions', async () => {
    AWSmock.mock('CloudFront', 'listDistributions', (params, callback) => {
      callback(null, {
        DistributionList: {
          Items: [
            { Id: '1', Aliases: { Items: ['example.com'] } },
            { Id: '2', Aliases: { Items: ['example.com'] } },
            { Id: '3', Aliases: { Items: ['example.com'] } },
            { Id: '4', Aliases: { Items: ['example.com'] } },
          ],
        },
      });
    });
    let calledIds = [];
    AWSmock.mock('CloudFront', 'createInvalidation', (params, callback) => {
      calledIds.push(params.DistributionId);
      callback(null, {});
    });
    await invalidateCache('example.com');
    expect(calledIds.length).toBe(4);
    expect(calledIds).toContain('1');
    expect(calledIds).toContain('2');
    expect(calledIds).toContain('3');
    expect(calledIds).toContain('4');
  });

  it('should reject unless cname match distributions', () => {
    AWSmock.mock('CloudFront', 'listDistributions', (params, callback) => {
      callback(null, {
        DistributionList: {
          Items: [{ Id: 'MyId', Aliases: { Items: ['xxxxxxxxxx'] } }],
        },
      });
    });
    AWSmock.mock('CloudFront', 'createInvalidation', (params, callback) => {
      callback(null, {});
    });
    return expect(invalidateCache('example.com')).rejects.toThrow();
  });
});
