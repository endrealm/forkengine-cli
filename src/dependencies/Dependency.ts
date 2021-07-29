export type Dependency = {
    name: string,
    source: string  // this is either name (if a local dependency) or a repo

    version?: string
    weak?: boolean,
    branch?: string,

    dependents: string[]
}

export function isSameDependency(dep1: Dependency, dep2: Dependency): boolean {
    return dep1.name === dep2.name && dep1.source === dep2.source && dep1.branch === dep2.branch
}


export type ModuleDependencyConflict = {
    dependants: {
        dependant: string[],
        value?: string
    }[]
}

export type DependencyResolverResult = {
    branchConflicts: ModuleDependencyConflict[],
    sourceConflicts: ModuleDependencyConflict[],

    dependencies: Dependency[]
}