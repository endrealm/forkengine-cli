import {Command} from "commander";
import inquirer from "inquirer";
import {cloneRepo} from "../util/Git";
import ora from "ora"
import CreateModule from "./CreateModule";
import path from "path";
import Config from "../util/Config";


export default async function (projectName?: string, options?: {}) {
    if(!projectName) {
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

        projectName = results.moduleName as string;
    }

    const spinner = ora({
        text: "Cloning repository"
    }).start()

    const repoName = Config.get<string>("templateProject")
    try {
        await cloneRepo(repoName, undefined, projectName)
    } catch {
        spinner.fail("Failed to clone repository")
        process.exit(1)
        return;
    }

    spinner.succeed("Cloned repository")

    process.chdir(path.join(process.cwd(), projectName))
    await CreateModule("main", {})
}