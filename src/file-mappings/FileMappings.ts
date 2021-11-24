export type ModuleJSON = {
    version: string,
    dependencies: {
        [dependency: string]: DependencyConfiguration
    }
}


export type ModuleConfiguration = {
    name: string,
    moduleJson: ModuleJSON
}


export type DependencyConfiguration = {
    branch?: string,
    weak?: boolean,
    local?: string
}