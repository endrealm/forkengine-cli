import {IModuleLoader} from "../ModuleLoader";
import {DependencyConfiguration, ModuleJSON} from "../../file-mappings/FileMappings";
import Path from "path";
import {getForkengineRoot} from "../../util/FileUtil";
import * as fs from "fs";
import { cloneRepo } from "../../util/Git";
import { getLocalNameFromModuleRepoUrl } from "../../dependencies/GitDependency";

export default class ModuleLoader implements IModuleLoader {


    constructor(private readonly root: string) {

    }


    supports(version: string): boolean {
        return true;
    }

    async loadModuleJSON(moduleName: string, location: string = this.root): Promise<ModuleJSON> {
        const moduleJSONPath = Path.join(getForkengineRoot(location), "modules", moduleName, "forkengine-module.json");
        return JSON.parse(await fs.promises.readFile(moduleJSONPath, "utf8")) as ModuleJSON;
    }

    async cloneModuleRepo(url: string, cloneConfig: DependencyConfiguration) {
        await cloneRepo(url, cloneConfig.branch, cloneConfig.local || getLocalNameFromModuleRepoUrl(url), undefined, Path.join(this.root, "modules"))
    }

    async exists(moduleName: string, location: string = this.root): Promise<boolean> {
        return fs.existsSync(Path.join(location, "modules", moduleName))
    }

}