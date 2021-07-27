import inquirer from "inquirer";
import config from "config"
import {cloneRepo} from "../util/Git";
import ora from "ora"
import {getForkengineRoot, getProjectVersion, isForkengineProject} from "../util/FileUtil";
import * as fs from "fs";
import * as Path from "path";
import {IModuleCreator} from "../versions/ModuleCreator";
import ModuleCreatorV1 from "../versions/1.0.0/ModuleCreator";


export default async function(moduleName?: string, options?: {}) {
    if(!isForkengineProject()) {
        throw new Error("Folder is not a Forkengine project")
    }

    const creators: IModuleCreator[] = [new ModuleCreatorV1()]

    if(!moduleName) {
        const results = await inquirer.prompt([
            {
                type: "input",
                name: "moduleName",
                message: "What should the name of your module be",
                validate(input: string): boolean | string | Promise<boolean | string> {
                    const re = /^[a-zA-Z0-9_]+$/;
                    return re.test(input)
                }
            }
        ])

        moduleName = results.moduleName as string;
    }

    const version = getProjectVersion()
    const creator = creators.find(creator => creator.supports(version));
    if(!creator) {
        throw new Error(`Unsupported project version detected: ${version}`)
    }

    await creator.createModule(moduleName);
}