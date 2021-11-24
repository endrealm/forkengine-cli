import { DependencyConfiguration, ModuleConfiguration, ModuleJSON } from "../file-mappings/FileMappings"
import { IModuleLoader } from "../versions/ModuleLoader"



export type LoadableDependency = {
    name: string,
    config: DependencyConfiguration
}

export abstract class Dependency {


    private readonly dependants: Dependency[] = []

    private resolved: boolean = false


    protected constructor(private readonly preset: boolean = false) {

    }


    isResolved() {
        return this.resolved
    }

    protected setResolved() {
        this.resolved = true;
    }

    protected abstract resolve(): Promise<void>

    async startResolve() {
        await this.resolve()
    }

    isPreset() {
        return this.isPreset
    }

    abstract getName(): string


    addDependant(dependant: Dependency) {
        this.dependants.push(dependant)
    }

    getDependant() {
        return this.dependants
    }

    public abstract getDependencies(): LoadableDependency[]

}



export abstract class BasicDependency extends Dependency {


    private config?: ModuleJSON


    protected constructor(  private readonly name: string,
                            protected readonly moduleLoader: IModuleLoader, 
                            preset: boolean = false) {
        super(preset)
    }


    getName() {
        return this.name
    }

    async preResolve() {

    }

    async resolve() {
        await this.preResolve()
        this.config = await this.moduleLoader.loadModuleJSON(this.name)

        this.setResolved();
    }

    getDependencies(): LoadableDependency[] {
        if(!this.config) return []

        const result = []
        for (const name in this.config.dependencies) {
            result.push({
                name,
                config: this.config.dependencies[name]
            })
        }
        return result
    }

}