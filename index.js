const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
var cors = require("cors");
const port = process.env.PORT || 5000;


// username = bigbazar
// password = oizxMIb2xPevh2cP

app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.0x0jt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
      const productCollection = client.db("bigbazar").collection("product");
      app.post("/post", async(req, res) => {
          const product = req.body;
      console.log(product);
          const result = await productCollection.insertOne(product);
          res.send(result)
      })
      app.get("/productslist", async (req, res) => {
          const cursor = productCollection.find({});
          const result = await cursor.toArray();
          res.send(result);

      })
      
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
