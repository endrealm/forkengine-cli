import {getProjectVersion, isForkengineProject} from "../util/FileUtil";
import {IModuleLoader} from "../versions/ModuleLoader";
import ModuleLoaderV1 from "../versions/1.0.0/ModuleLoader"
import {IDependencyHandler} from "../versions/DependencyHandler";
import DependencyHandlerV1 from "../versions/1.0.0/DependencyHandler"

export default async function(options?: {}) {
    if(!isForkengineProject()) {
        throw new Error("Folder is not a Forkengine project")
    }

    const version = getProjectVersion()
    const moduleLoaders: IModuleLoader[] = [new ModuleLoaderV1()]
    const moduleLoader = moduleLoaders.find(moduleLoader => moduleLoader.supports(version))
    if(!moduleLoader)
        throw new Error(`Unsupported project version detected: ${version}`)

    const moduleJSONFiles = await Promise.all((await moduleLoader.getAllModules()).map(moduleName => moduleLoader.loadModuleJSON(moduleName)))

    const dependencyHandlers: IDependencyHandler[] = [new DependencyHandlerV1()]
    const dependencyHandler = dependencyHandlers.find(dependencyHandler => dependencyHandler.supports(version))
    if(!dependencyHandler)
        throw new Error(`Unsupported project version detected: ${version}`)

    const results = await dependencyHandler.handleDependencies(moduleJSONFiles, {});

    console.log(results)
}