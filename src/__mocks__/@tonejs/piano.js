class Piano{
    constructor(options){
        this.velocities = options["velocities"];
    }

    toDestination(){
        return this;
    }

    async load(){
        return await jest.fn(() => Promise.resolve({}))
    }
}

module.exports = { Piano }