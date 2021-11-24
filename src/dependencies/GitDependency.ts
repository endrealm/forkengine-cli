import { config } from "shelljs"
import { DependencyConfiguration } from "../file-mappings/FileMappings"
import { cloneRepo } from "../util/Git"
import { IModuleLoader } from "../versions/ModuleLoader"
import { BasicDependency } from "./Dependency"

type Config = {
    name: string,
    branch: string | undefined,
    version: string | undefined
    repoUrl: string
}

export class GitDependency extends BasicDependency {


    constructor(private readonly url: string, private readonly cloneConfig: DependencyConfiguration, moduleLoader: IModuleLoader, preset?: boolean) {
        super(getLocalNameFromModuleRepoUrl(url), moduleLoader, preset)
    }

    async preResolve() {
        if(!await this.moduleLoader.exists(getLocalNameFromModuleRepoUrl(this.url)))
            await this.moduleLoader.cloneModuleRepo(this.url, this.cloneConfig)
    }

    getName() {
        return this.url;
    }

}

export function getLocalNameFromModuleRepoUrl(url: string): string {
    return url.split("/")[url.split("/").length - 1]
}