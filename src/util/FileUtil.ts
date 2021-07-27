import * as Path from "path";
import * as fs from "fs";
import {ForkengineProjectConfig} from "../Types";

const FORKENGINE_FILE_NAME = "forkengine.json"


export function isForkengineProject(location: string = process.cwd()): boolean {
    return fs.existsSync(Path.join(location, FORKENGINE_FILE_NAME))
}

export function getProjectVersion(location: string = process.cwd()): string {
    return getProjectData(location).version;
}

export function getProjectData(location: string = process.cwd()): ForkengineProjectConfig {
    const path = Path.join(getForkengineRoot(location), FORKENGINE_FILE_NAME)
    return JSON.parse(fs.readFileSync(path, "utf8")) as ForkengineProjectConfig
}

export function getForkengineRoot(location: string = process.cwd()): string {
    return location;
}