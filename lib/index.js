'use strict';

const AWS = require('aws-sdk');

const cloudfront = new AWS.CloudFront();

async function invalidateCache(cname) {
  let distributions = await listDistributions({});
  distributions = distributions.filter(dist => dist.Aliases.Items.includes(cname));
  if (distributions.length === 0) {
    throw new Error(`Distribution matching cname "${cname}" was not found.`);
  }
  for (const dist of distributions) {
    await createInvalidation(dist.Id);
  }
}

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

module.exports = { invalidateCache };
