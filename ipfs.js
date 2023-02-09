require('dotenv').config();


//testing with ipfs


async function ipfsClient() {
    const { create } = await import('ipfs-http-client')
    const { INFURA_PROJECT_ID, INFURA_API_SECRET } = process.env;

    const client = await create(
        {
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            headers: {
                "Authorization": `Basic ${Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_API_SECRET).toString("base64")}`
            }
        })

    client.add('Hello World').then((res) => {
        return res.path;
    });
    //QmU74WxeHKfuSXs4nFVAeVLK6GGb2RKg2PuaoFJV31P6au
    /*     client.get("QmUXTtySmd7LD4p6RG6rZW6RuUuPZXTtNMmRQ6DSQo3aMw", function (err, res) {
            console.log(res);
        });
     */
    /*  const result = await client.get("QmU74WxeHKfuSXs4nFVAeVLK6GGb2RKg2PuaoFJV31P6au")
     let contents = ""
 
     // loop over incoming data
     for await (const item of result) {
         // turn string buffer to string and append to contents
         contents += new TextDecoder().decode(item)
 
     }
     contents = contents.replace(/\0/g, "")
     console.log(contents.substring(contents.indexOf("{"))); */
}
console.log(ipfsClient());
