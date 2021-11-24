import {getForkengineRoot, getProjectVersion, isForkengineProject} from "../util/FileUtil";
import {IModuleLoader} from "../versions/ModuleLoader";
import ModuleLoaderV1 from "../versions/1.0.0/ModuleLoader"
import {IDependencyHandler} from "../versions/DependencyHandler";
import DependencyHandlerV1 from "../versions/1.0.0/DependencyHandler"
import {ModuleJSON} from "../file-mappins/FileMappings";
import * as util from "util";
import {ModuleDependencyConflict} from "../dependencies/Dependency";
import inquirer from "inquirer";
import {deprecate} from "util";

export default async function(options?: {}) {
    if(!isForkengineProject()) {
        throw new Error("Folder is not a Forkengine project")
    }

    const root = getForkengineRoot()

    const version = getProjectVersion()

    const moduleLoaders: IModuleLoader[] = [new ModuleLoaderV1()]
    const moduleLoader = moduleLoaders.find(moduleLoader => moduleLoader.supports(version))
    if(!moduleLoader)
        throw new Error(`Unsupported project version detected: ${version}`)

    const moduleFiles: {[moduleName: string]: ModuleJSON} = {}
    for(const moduleName of await moduleLoader.getAllModules()) {
        moduleFiles[moduleName] = await moduleLoader.loadModuleJSON(moduleName)
    }

    const dependencyHandlers: IDependencyHandler[] = [new DependencyHandlerV1()]
    const dependencyHandler = dependencyHandlers.find(dependencyHandler => dependencyHandler.supports(version))
    if(!dependencyHandler)
        throw new Error(`Unsupported project version detected: ${version}`)

    const results = await dependencyHandler.handleDependencies(moduleFiles, root);

    if(results.sourceConflicts.length > 0 || results.branchConflicts.length > 0)
        throw new Error("Unresolved conflicts")

    // await dependencyHandler.updateDependencies(results.dependencies, root, version)

    await createConflictInput({
        module: "test",
        dependants: [
            {
                dependant: ["boot", "main"],
                value: "option1"
            },
            {
                dependant: ["renderer", "hello-world"],
                value: "option2"
            }
        ]
    }, "source")
}


async function createConflictInputList(branchConflicts: ModuleDependencyConflict[], sourceConflicts: ModuleDependencyConflict[]): Promise<void> {
    for (let branchConflict of branchConflicts) {
        await createConflictInput(branchConflict, "branch")
    }
    for (let sourceConflict of sourceConflicts) {
        await createConflictInput(sourceConflict, "source")
    }
}


async function createConflictInput(conflict: ModuleDependencyConflict, type: "source" | "branch"): Promise<string> {
    const message = type === "source" ? `Resolve source conflict for module: ${conflict.module}` : `Resolve branch conflict for module: ${conflict.module}`

    const choices = conflict.dependants.map(dependant => {
        let dependants = ""
        dependant.dependant.forEach(dep => dependants += dep + " ")

        return {
            name: `${dependant.value}: ${dependants}`,
            value: dependant.value
        }
    })

    const results = await inquirer.prompt([
        {
            type: "list",
            name: "conflict",
            message,
            choices
        }
    ])

    return results.conflict as string
}