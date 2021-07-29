export type ModuleJSON = {
    version: string,
    dependencies: {
        [dependency: string]: {
            branch?: string,
            weak?: boolean
        }
    }
}