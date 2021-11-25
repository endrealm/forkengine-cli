import {Command} from "commander";
import inquirer from "inquirer";
import {cloneRepo} from "../util/Git";
import ora from "ora"
import CreateModule from "./CreateModule";
import path from "path";
import Config from "../util/Config";
import { spinnerWrapPromise } from "../util/SpinnerUtil";


export default async function (projectName?: string, options?: {}) {
    if(!projectName) {
        const results = await inquirer.prompt([
            {
                type: "input",
                name: "projectName",
                message: "What should the name of your project be",
                validate(input: string): boolean | string | Promise<boolean | string> {
                    const re = /^[a-zA-Z0-9_-]+$/;
                    return re.test(input)
                }
            }
        ])

        projectName = results.projectName as string;
    }

    const repoName = Config.get<string>("templateProject")

    await spinnerWrapPromise("Cloning repository", "Cloned repository", "Failed to clone repository", cloneRepo(repoName, undefined, projectName, "origin"), () => {}, () => process.exit(1))

    process.chdir(path.join(process.cwd(), projectName))
    // await CreateModule("main", {})
}