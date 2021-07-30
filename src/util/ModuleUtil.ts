import {ModuleJSON} from "../file-mappins/FileMappings";
import * as fs from "fs";
import * as Path from "path";
import { type } from "os";
import {REMOTE_MODULE_RESOLVERS} from "./remote/RemoteModuleResolver";

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
        return REMOTE_MODULE_RESOLVERS.find(resolver => resolver.supports(source, branch || "main"))!.resolve(source, branch || "main")
    }
}

