import { Dependency } from "../dependencies/Dependency";

export interface IDependencyHandler {


    supports(version: string): boolean

    resolveProject(): Promise<Dependency[]>

}