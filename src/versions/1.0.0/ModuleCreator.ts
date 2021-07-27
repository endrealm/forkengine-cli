import {IModuleCreator} from "../ModuleCreator";
import ora from "ora";
import fs from "fs";
import Path from "path";
import {getForkengineRoot} from "../../util/FileUtil";

export default class ModuleCreator implements IModuleCreator {

    supports(version: string): boolean {
        return true;
    }

    async createModule(moduleName: string): Promise<any> {
        const spinner = ora({
            text: `Creating module "${moduleName}"`,
        }).start()

        await fs.promises.mkdir(Path.join(getForkengineRoot(), "src", "app", "modules", moduleName), {recursive: true})

        spinner.succeed(`Created module "${moduleName}"`)
    }

}