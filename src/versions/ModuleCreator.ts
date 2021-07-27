export interface IModuleCreator {
    supports(version: string): boolean
    createModule(moduleName: string): any
}