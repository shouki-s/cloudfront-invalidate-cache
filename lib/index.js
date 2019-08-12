'use strict';

const AWS = require('aws-sdk');

const cloudfront = new AWS.CloudFront();

async function listDistributions() {
  let distributions = [];

  let data;
  let marker;
  do {
    data = await cloudfront
      .listDistributions({
        Marker: marker,
      })
      .promise();
    distributions = distributions.concat(data.DistributionList.Items);
    marker = data.DistributionList.NextMarker;
  } while (data.DistributionList.IsTruncated);

  return distributions;
}

async function createInvalidation(distId) {
  console.log(`Creating invalidation for ${distId}.`);
  await cloudfront
    .createInvalidation({
      DistributionId: distId,
      InvalidationBatch: {
        CallerReference: String(new Date().getTime()),
        Paths: {
          Quantity: 1,
          Items: ['/*'],
        },
      },
    })
    .promise();
}

module.exports = { listDistributions, createInvalidation };
