import * as shell from "shelljs"
import * as fs from "fs";
import * as Path from "path";

export async function cloneRepo(url: string, folderName: string, location: string = process.cwd()) {
    const path = Path.join(location, folderName);
    if(fs.existsSync(path)) {
        throw new Error("Directory exists already")
    }

    shell.config.silent = true
    shell.cd(location)
    await new Promise<void>(resolve => {
        shell.exec(`git clone ${url} ${folderName}`, () => {
            resolve();
        })
    })
}