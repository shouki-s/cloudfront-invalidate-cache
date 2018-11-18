#!/usr/bin/env node
'use strict';

const AWS = require('aws-sdk');
const yargs = require('yargs');

const argv = yargs
  .option('cname', {
    coerce(arg) {
      if (arg === '') throw new Error('Cname is empty.');
      return arg;
    },
    demandOption: true,
    describe: 'CNAME aliases',
    type: 'string',
  })
  .demandOption('cname')
  .help().argv;

const cloudfront = new AWS.CloudFront();

async function main() {
  let distributions = await listDistributions({});
  distributions = distributions.filter(dist => dist.Aliases.Items.includes(argv.cname));
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
  console.log(`create invalidation for ${distId}.`);
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

main();
