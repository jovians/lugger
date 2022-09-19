#! /usr/bin/env node
// RITZ SKIP
/* Jovian (c) 2020, License: MIT */
import { Command } from 'commander';
import { Ritz, ritzTransformByPattern, ritzRevertByPattern, ritzOutputResult, RitzCli } from 'ritz2';

const program = new Command();

const version = '0.0.1';

program
  .name('lugger')
  .description(`Lugger CLI v${version}`)
  .version(version);

const ritz = program
  .command('ritz')
  .description('RITZ transform utility');

  RitzCli.loadCommand(ritz, 'run');
  RitzCli.loadCommand(ritz, 'transform');
  RitzCli.loadCommand(ritz, 'revert');
  RitzCli.loadCommand(ritz, 'recompile');

program.parse();
