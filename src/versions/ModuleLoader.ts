import {DependencyConfiguration, ModuleConfiguration, ModuleJSON} from "../file-mappings/FileMappings";

export interface IModuleLoader {
    supports(version: string): boolean;

    loadModuleJSON(module: string, location?: string): Promise<ModuleJSON>
    cloneModuleRepo(url: string, cloneConfig: DependencyConfiguration): Promise<void>
    exists(module: string, location?: string): Promise<boolean>

}