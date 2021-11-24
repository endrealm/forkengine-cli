import { IModuleLoader } from "../versions/ModuleLoader";
import { BasicDependency } from "./Dependency";


export class LocalDependency extends BasicDependency {

    constructor(name: string, moduleLoader: IModuleLoader, preset?: boolean) {
        super(name, moduleLoader, preset)
    }

}