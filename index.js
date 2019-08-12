#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const { invalidateCache } = require('./lib');

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
  await invalidateCache(argv.cname);
  console.log('Done!');
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
  return err;
});
