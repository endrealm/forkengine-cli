import {IDependencyHandler} from "../DependencyHandler";
import {ModuleJSON} from "../../file-mappins/FileMappings";
import {
    Dependency,
    DependencyResolverResult,
    isSameDependency,
    ModuleDependencyConflict
} from "../../dependencies/Dependency";
import {
    getLocalModuleConfig,
    getModuleConfig,
    getModuleName,
    isModuleInstalled,
    isRemoteRepository
} from "../../util/ModuleUtil";
import util from "util";
import {cloneRepo} from "../../util/Git";
import Path from "path";

export default class DependencyHandler implements IDependencyHandler{


    async handleDependencies(moduleFiles: {[p: string]: ModuleJSON}, projectRoot: string): Promise<DependencyResolverResult> {
        let dependencies: Dependency[] = [];

        // add all dependencies from already existing modules
        for (let moduleName in moduleFiles) {
            const module = moduleFiles[moduleName];
            dependencies.push(...DependencyHandler.getDependenciesFromModule(moduleName, module))
        }

        // keep adding remote dependencies until all are added
        let newDependencies: boolean = true
        while(newDependencies) {
            newDependencies = false

            for (let module of dependencies) {
                const config = await  getModuleConfig(module.source, projectRoot)
                const moduleDependencies = DependencyHandler.getDependenciesFromModule(module.name, config)
                moduleDependencies.forEach(i => {
                    const sameDep = dependencies.find(j => isSameDependency(i, j))
                    if(sameDep) {
                        if(sameDep.dependents.indexOf(module.name) < 0) sameDep.dependents.push(module.name)
                    } else {
                        dependencies.push(i)
                    }
                })
            }
        }

        return this.simplifyDependencies(dependencies);
    }


    private simplifyDependencies(dependencies: Dependency[]): DependencyResolverResult {
        const result: DependencyResolverResult = {dependencies: [], sourceConflicts: [], branchConflicts: []}

        dependencies.forEach(dependency => {
            const already = result.dependencies.find(dep => dep.name === dependency.name);
            if(already) {
                if(isSameDependency(already, dependency)) {
                    already.weak = already.weak && dependency.weak;
                } else {
                    if(already.source !== dependency.source) {
                        const values = [{dependants: already.dependents, value: already.source}, {dependants: dependency.dependents, value: dependency.source}];
                        this.addConflict(already.name, values, result.sourceConflicts)
                    }
                    if(already.branch !== dependency.branch) {
                        const values = [{dependants: already.dependents, value: already.branch}, {dependants: dependency.dependents, value: dependency.branch}];
                        this.addConflict(already.name, values, result.branchConflicts)
                    }

                    return;
                }
            } else {
                result.dependencies.push(dependency)
            }
        })

        result.branchConflicts = this.simplifyConflicts(result.branchConflicts)
        result.sourceConflicts = this.simplifyConflicts(result.sourceConflicts)

        return result
    }


    private addConflict(module: string, values: {dependants: string[], value: string | undefined}[], conflicts: ModuleDependencyConflict[]): void {
        values.forEach(value => {
            conflicts.push({
                module,
                dependants: [{
                    dependant: value.dependants,
                    value: value.value
                }]
            })
        })
    }


    private simplifyConflicts(conflicts: ModuleDependencyConflict[]): ModuleDependencyConflict[] {
        const result: ModuleDependencyConflict[] = []

        conflicts.forEach(conflict => {
           const entry = result.find(module => module.module === conflict.module)
           if(entry) {
               conflict.dependants.forEach(dependant => {
                   const valueEntry = entry.dependants.find(dep => dep.value === dependant.value)
                   if(valueEntry) {
                       dependant.dependant.forEach(dep => {
                           if(valueEntry.dependant.indexOf(dep) < 0) valueEntry.dependant.push(dep)
                       })
                   } else {
                       entry.dependants.push(dependant)
                   }
               })
           } else {
               result.push(conflict)
           }
        })

        return result;
    }


    async updateDependencies(dependencies: Dependency[], projectRoot: string, projectVersion: string): Promise<void> {
        for (let module of dependencies) {
            if(await isModuleInstalled(module.name, projectRoot)) {
                const version = (await getLocalModuleConfig(module.name, projectRoot)).version;

                if(isRemoteRepository(module.source)) {
                    // Update if necessary
                }
            } else {
                // clone it

                const path = Path.join(projectRoot, "modules")
                await cloneRepo(module.source, module.branch, module.name, undefined, path)
            }
        }
    }


    private static getDependenciesFromModule(moduleName: string, module: ModuleJSON): Dependency[] {
        let dependencies: Dependency[] = [];
        for (let dependencySource in module.dependencies) {
            if(!module.dependencies.hasOwnProperty(dependencySource)) continue

            const dependency = module.dependencies[dependencySource]
            dependencies.push({
                name: getModuleName(dependencySource),
                dependents: [moduleName],
                source: dependencySource,
                branch: dependency.branch,
                weak: dependency.weak === true,
            })
        }
        return dependencies;
    }


    supports(version: string): boolean {
        return true;
    }


}