import {ModuleJSON} from "../file-mappins/FileMappings";

export interface IModuleLoader {
    supports(version: string): boolean;

    loadModuleJSON(module: string, location?: string): Promise<ModuleJSON>
    getAllModules(location?: string): Promise<string[]>
}