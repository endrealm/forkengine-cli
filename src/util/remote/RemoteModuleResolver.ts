import {ModuleJSON} from "../../file-mappings/FileMappings";
import fetch from "node-fetch";

export interface RemoteModuleResolver {
    resolve(source: string, branch: string): Promise<ModuleJSON>
    supports(source: string, branch: string): boolean
}


function getStrippedGitUrl(url: string): [string, string] {
    // https://github.com/endrealm/forkengine-core
    const parts = url.split("/")
    if(parts.length < 4) {
        throw new Error("Not a valid url")
    }
    return [parts[3], parts[4]]
}

export class GithubModuleResolver implements RemoteModuleResolver{
    async resolve(source: string, branch: string): Promise<ModuleJSON> {
        const [org, proj] = getStrippedGitUrl(source)
        const url = `https://raw.githubusercontent.com/${org}/${proj}/${branch}/forkengine-module.json`
        let json: ModuleJSON;
        try {
            json = (await fetch(url, {method: "GET"}).then(res => res.json())) as ModuleJSON;
        } catch (e) {
            throw new Error("Failed to fetch module config from repository")
        }

        // TODO: validate module json content

        return json;
    }

    supports(source: string, branch: string): boolean {
        return source.split("/").length > 4 &&source.startsWith("https://github.com/");
    }

}

export const REMOTE_MODULE_RESOLVERS: RemoteModuleResolver[] = [new GithubModuleResolver()]