import { Dependency, LoadableDependency } from "../../dependencies/Dependency";
import { GitDependency } from "../../dependencies/GitDependency";
import { LocalDependency } from "../../dependencies/LocalDependency";
import { isGitDependency } from "../../util/Git";
import { IDependencyHandler } from "../DependencyHandler";
import { IModuleLoader } from "../ModuleLoader";
import * as fs from "fs"
import Path from "path";
import { ForkengineJSON } from "../../file-mappings/FileMappings";


export class DependencyHandlerV1 implements IDependencyHandler {

    constructor(private readonly moduleLoader: IModuleLoader, private readonly root: string) {

    }

    supports() {
        return true;
    }

    /* iterate over every dependency, see if its added and make sure its resolved 
     * and look for conflicts
     */
    async resolveProject() {
        const bootModule = (JSON.parse(await fs.promises.readFile(Path.join(this.root, "forkengine.json"), "utf8")) as ForkengineJSON).bootModule

        const modules: Dependency[] = []

        const mainModule = this.createModuleInstance({
            name: bootModule?.name || "main" ,
            config: bootModule?.config || {}
        })
        await mainModule.startResolve()
        modules.push(mainModule)

        let foundNewDepnendecy = true
        while(foundNewDepnendecy) {
            foundNewDepnendecy = false
            for(const module of modules) {
                for(const loadableDependency of module.getDependencies()) {

                    let dependencyModule = modules.find(module => module.getName() === loadableDependency.name)

                    if(!dependencyModule) {
                        dependencyModule = this.createModuleInstance(loadableDependency)
                        modules.push(dependencyModule)

                        foundNewDepnendecy = true
                    } else {
                        // TODO make sure no conflict happens
                    }


                    if(!dependencyModule.isResolved()) {
                        await dependencyModule.startResolve()
                    }
                }
            }
        }

        return modules;
    }

    private createModuleInstance(dependency: LoadableDependency): Dependency {
        if(isGitDependency(dependency.name)) {
            return new GitDependency(dependency.name, dependency.config, this.moduleLoader)
        }

        return new LocalDependency(dependency.name, this.moduleLoader)
    }

}