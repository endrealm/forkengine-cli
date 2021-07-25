#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import {program} from 'commander';

clear();
console.log(
    chalk.red(
        figlet.textSync('forkengine-cli', { horizontalLayout: 'full' })
    )
);

program
    .version('0.1')
    .description("The cli for forkengine projects")
    .option('-i, --init', 'Init a new forkengine project')
    .parse(process.argv);
    
if (!process.argv.slice(2).length) {
    program.outputHelp();
}