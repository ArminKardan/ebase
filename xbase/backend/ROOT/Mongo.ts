
import umongodblib from '../mobgolib/umongo'
import mongodblib from '../mobgolib/mongo'


export default async () => {

    let json = await api("https://qepal.com/api/explore/getmongourl",
        { secret: process.env.EXPLORE_SECRET })

    if (json.code == 0 && json.mongourl) {
        process.env.UMONGOURL = json.mongourl
        process.env.UMONGODB_DB = (json.mongourl as string).split(":")[1].replace("//", "")
    }

    if (process.env.MONGOURL && !global.mongo) {
        global.mongo = await mongodblib()
        global.db = global.mongo.db("qepal")
        let owneruser = await global.db.collection("users").findOne({});
        if (owneruser)
        {
            console.log("Connection with Mongo DB was SUCCESSFULL...")
        }
    }

    if (process.env.UMONGOURL && !global.umongo) {
        global.umongo = await umongodblib()
        global.udb = global.umongo.db(process.env.UMONGODB_DB)
        console.log("Connection with U-Mongo DB was SUCCESSFULL...")
    }



    if (!global.ObjectId) {
        let mongo = await (await import("mongodb")).ObjectId
        global.ObjectId = mongo
    }
    if (!global.Long) {
        global.Long = await (await import("mongodb")).Long
    }

}
