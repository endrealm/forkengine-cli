import { type } from "os"
import { LoadableDependency } from "../dependencies/Dependency"

export type ModuleJSON = {
    version: string,
    dependencies: {
        [dependency: string]: DependencyConfiguration
    }
}

export type ForkengineJSON = {
    version: string,
    bootModule?: LoadableDependency
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