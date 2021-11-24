import * as shell from "shelljs"
import * as fs from "fs";
import * as Path from "path";

export async function cloneRepo(url: string, branch: string | undefined, folderName: string, unlinkRemote?: string, location: string = process.cwd()) {
    const path = Path.join(location, folderName);
    if(fs.existsSync(path)) {
        throw new Error("Directory exists already")
    }

    shell.config.silent = true
    shell.cd(location)

    const branchExtension = branch? `--branch ${branch} ` : ""

    await new Promise<void>(resolve => {
        shell.exec(`git clone ${branchExtension}${url} ${folderName}`, () => {
            resolve();
        })
    })

    if(unlinkRemote) {
        await new Promise<void>(resolve => {
            shell.cd(path)
            shell.exec(`git remote rm ${unlinkRemote}`, () => resolve())
            shell.cd(location)
        })
    }
}



export function isGitDependency(url: string) {
    // TODO fix. this.
    return url.indexOf("/") > -1
}