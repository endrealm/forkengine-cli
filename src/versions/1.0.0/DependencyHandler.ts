import {IDependencyHandler} from "../DependencyHandler";
import {ModuleJSON} from "../../file-mappins/FileMappings";
import {Dependency, DependencyResolverResult, isSameDependency} from "../../dependencies/Dependency";
import {
    getLocalModuleConfig,
    getModuleConfig,
    getModuleName,
    isModuleInstalled,
    isRemoteRepository
} from "../../util/ModuleUtil";
import util from "util";

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

        console.log(util.inspect(dependencies, {showHidden: false, depth: null}))

        dependencies.forEach(dependency => {
            const already = result.dependencies.find(dep => dep.name === dependency.name);
            if(already) {
                if(isSameDependency(already, dependency)) {
                    already.weak = already.weak && dependency.weak;
                } else {
                    if(already.source !== dependency.source) {
                        result.sourceConflicts.push({
                            module: already.name,
                            dependants: [{dependant: already.dependents, value: already.source}, {dependant: dependency.dependents, value: dependency.source}]
                        })
                    }
                    if(already.branch !== dependency.branch) {
                        result.branchConflicts.push({
                            module: already.name,
                            dependants: [{dependant: already.dependents, value: already.branch}, {dependant: dependency.dependents, value: dependency.branch}]
                        })
                    }

                    return;
                }
            } else {
                result.dependencies.push(dependency)
            }
        })

        return result
    }


    async updateDependencies(dependencies: Dependency[], projectRoot: string, projectVersion: string): Promise<void> {
        for (let module of dependencies) {
            if(await isModuleInstalled(module.name, projectRoot)) {
                const version = (await getLocalModuleConfig(module.name, projectRoot)).version;

                if(!module.weak && version.split(".")[0] !== projectVersion.split(".")[0]) {
                    // update module

                    if(isRemoteRepository(module.source)) {
                        // git pull
                    } else {
                        throw new Error("Local dependency " + module.name + " uses an outdated engine version")
                    }
                }
            } else {
                // clone it
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