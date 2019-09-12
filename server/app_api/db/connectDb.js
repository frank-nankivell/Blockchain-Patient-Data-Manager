import MongoClient  from 'mongodb';
import promisify from 'es6-promisify';

var dbURI = "mongodb://localhost:27017/bigchain";
if (process.env.NODE_ENV === 'production') {
  dbURI = 'enterProdURL';
}

var options = { 
    useNewUrlParser: true, 
    poolSize: 10, 
    reconnectTries: 60, 
    reconnectInterval: 500, 
    useUnifiedTopology: true
  };

let _connection;

const connect = () => {
  if (!dbURI) {
    throw new Error(`Environment variable MONGO_CONNECTION_STRING must be set to use API.`);
  }

  return promisify(MongoClient.connect)(dbURI, options);
};

/**
 * Returns a promise of a `db` object. Subsequent calls to this function returns
 * the **same** promise, so it can be called any number of times without setting
 * up a new connection every time.
 */
const connection = () => {
  if (!_connection) {
    _connection = connect();
  }

  return _connection;
};

export default connection;

/**
 * Returns a ready-to-use `collection` object from MongoDB.
 *
 * Usage:
 *
 *   (await getCollection('users')).find().toArray().then( ... )
 */
export async function getCollection(collectionName) {
  const db = await connection();
  return db.collection(collectionName);
}