import {IModuleLoader} from "../ModuleLoader";
import {ModuleJSON} from "../../file-mappins/FileMappings";
import Path from "path";
import {getForkengineRoot} from "../../util/FileUtil";
import * as fs from "fs";

export default class ModuleLoader implements IModuleLoader {

    supports(version: string): boolean {
        return true;
    }

    async loadModuleJSON(moduleName: string, location: string = process.cwd()): Promise<ModuleJSON> {
        const moduleJSONPath = Path.join(getForkengineRoot(location), "modules", moduleName, "forkengine-module.json");
        return JSON.parse(await fs.promises.readFile(moduleJSONPath, "utf8")) as ModuleJSON;
    }

    async getAllModules(location: string): Promise<string[]> {
        const moduleDirectoryPath = Path.join(getForkengineRoot(location), "modules");
        return fs.readdirSync(moduleDirectoryPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)
    }

}