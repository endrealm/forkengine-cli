import {ModuleJSON} from "../file-mappins/FileMappings";
import * as fs from "fs";
import * as Path from "path";
import { type } from "os";

export function isRemoteRepository(name: string): boolean {
    return name.split("/").length > 1;
}

export function getModuleName(remoteName: string): string {
    const split = remoteName.split("/")
    return split[split.length-1]
}

export async function getModuleConfig(source: string, projectRoot: string, branch?: string): Promise<ModuleJSON> {
    if(isRemoteRepository(source)) {
        return JSON.parse(await fs.promises.readFile(Path.join(projectRoot, "modules", source, "forkengine-module.json")))
    } else {

    }
}

export async function getLocalModuleVersion(name: string, projectRoot: string): Promise<string> {

}


