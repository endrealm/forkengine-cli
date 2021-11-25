import {IModuleCreator} from "../ModuleCreator";
import ora from "ora";
import fs from "fs";
import Path from "path";
import {getForkengineRoot} from "../../util/FileUtil";
import { cloneRepo } from "../../util/Git";
import Config from "../../util/Config";
import { spinnerWrapPromise } from "../../util/SpinnerUtil";

export default class ModuleCreator implements IModuleCreator {

    supports(version: string): boolean {
        return true;
    }

    async createModule(moduleName: string): Promise<any> {
        const repo = Config.get("templateModule") as string
        const promise = cloneRepo(repo, undefined, moduleName, "origin", Path.join(getForkengineRoot(), "modules"))

        spinnerWrapPromise(
            "Cloning module template repository", 
            "Cloned module template repository", 
            "Failed to clone module template repository",
            promise
        )
    }

}