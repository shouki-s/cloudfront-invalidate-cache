#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const { listDistributions, createInvalidation } = require('./lib');

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

async function main() {
  let distributions = await listDistributions({});
  distributions = distributions.filter(dist => dist.Aliases.Items.includes(argv.cname));
  if (distributions.length === 0) {
    throw new Error(`Distribution matching cname "${argv.cname}" was not found.`);
  }
  for (const dist of distributions) {
    await createInvalidation(dist.Id);
  }
  console.log('Done!');
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
  return err;
});
