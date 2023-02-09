// import fastify
const fastify = require("fastify");
// import ipfs-http-client
const ipfs = require("ipfs-http-client")

// connect to local ipfs node
const client = ipfs.create()

// create the server object
const server = fastify({ logger: true });

// example route
server.get("/", async (request, reply) => {

    // fetch the content from ipfs
    const result = await client.get("QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u")

    // create a string to append contents to
    let contents = ""


    // loop over incoming data
    for await (const item of result) {
        // turn string buffer to string and append to contents
        contents += new TextDecoder().decode(item)
    }

    // remove null characters
    contents = contents.replace(/\0/g, "")

    // return results as a json
    return { message: contents };
});

// start server function
const start = async () => {
    await server.listen(3000).catch((err) => {
        fastify.log.error(err);
        process.exit(1);
    });
    console.log("Listening on port 3000")
};

// turn server on
start();