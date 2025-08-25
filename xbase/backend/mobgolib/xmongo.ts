// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb


// var MongoClient = require("mongodb").MongoClient
import { MongoClient } from "mongodb";


export default (uri) => {
  const options = {
  }

  let client = null;
  let clientPromise

  if (!uri) {
    throw new Error("Please provide X-Mongo URI")
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._xmongoClientPromise) {
      client = new MongoClient(uri, options)
      global._xmongoClientPromise = client.connect()
    }
    clientPromise = global._xmongoClientPromise
  }
  else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
  return clientPromise
}


