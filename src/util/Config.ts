class Config {

    private readonly valueStore: {
        [key: string]: any
    } = {
        templateProject: "https://github.com/endrealm/forkengine-template.git"
    }


    public get<T>(key: string): T {
        return this.valueStore[key];
    }

}


export default new Config()