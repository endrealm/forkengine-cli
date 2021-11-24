import { resolve } from "path/posix"
import * as shell from "shelljs"

export async function yarnInstall(location: string = process.cwd()) {
    shell.cd(location)
    await new Promise<void>(resolve => {
        shell.exec("yarn install", () => resolve());
    })
}