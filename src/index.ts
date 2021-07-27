#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import {program} from 'commander';
import Init from "./commands/Init";
import CreateModule from "./commands/CreateModule";


clear();
console.log(
    chalk.red(
        figlet.textSync('forkengine-cli', { horizontalLayout: 'full' })
    )
);
program
    .command("init", {isDefault: false})
    .argument("[project-name]")
    .description("creates a new forkengine project")
    .action(Init)

program
    .command("create-module", {isDefault: false})
    .argument("[module-name]")
    .description("creates a new forkengine module")
    .action(CreateModule)


program
    .action(() => defaultAction())

program
    .version('0.1')
    .description("The cli for forkengine projects")

program
    .parse(process.argv);




function defaultAction() {
    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
}