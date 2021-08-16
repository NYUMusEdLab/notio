class Piano{
    constructor(options){
        this.velocities = options["velocities"];
    }

    toDestination(){
        return "Going To Destination"
    }

    async load(){
        return new Promise(() => "SomeData");
    }
}

module.exports = { Piano }