import {DependencyResolverResult} from "../dependencies/Dependency";
import {ModuleJSON} from "../file-mappins/FileMappings";

export interface IDependencyHandler {
    supports(version: string): boolean

    handleDependencies(moduleFiles: {[p: string]: ModuleJSON}, projectRoot: string): Promise<DependencyResolverResult>
}