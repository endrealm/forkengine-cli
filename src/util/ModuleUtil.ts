import {ModuleJSON} from "../file-mappins/FileMappings";
import * as fs from "fs";
import * as Path from "path";

export function isRemoteRepository(name: string): boolean {
    return name.split("/").length > 1;
}

export function getModuleName(remoteName: string): string {
    const split = remoteName.split("/")
    return split[split.length-1]
}


export async function isModuleInstalled(module: string, projectRoot: string): Promise<boolean> {
    const path = Path.join(Path.join(projectRoot, "modules", module, "forkengine-module.json"))
    return fs.existsSync(path)
}


export async function getLocalModuleConfig(module: string, projectRoot: string): Promise<ModuleJSON> {
    const path = Path.join(Path.join(projectRoot, "modules", module, "forkengine-module.json"))
    return JSON.parse(await fs.promises.readFile(path, "utf8")) as ModuleJSON
}


export async function getModuleConfig(source: string, projectRoot: string, branch?: string): Promise<ModuleJSON> {
    if(!isRemoteRepository(source)) {
        return JSON.parse(await fs.promises.readFile(Path.join(projectRoot, "modules", source, "forkengine-module.json"), "utf8"))
    } else {
        throw new Error("")
    }
}