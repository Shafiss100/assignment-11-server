const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    app.post("/post", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      res.send({ success: "success fully post" });
    });
    app.get("/productslist", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // --------for homo page only 6 cards --------
    app.get("/productslisthome", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.limit(6).toArray();
      res.send(result);
    });

//---------- delete product----------    
    app.delete("/delete/:productId", async(req, res) => {
      const productId = req.params.productId;
      const query = { _id: ObjectId(productId) };
      const result = await productCollection.deleteOne(query)
      res.send(result);
    });

    //-------update Product ----------
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateProduct.name,
          img: updateProduct.img,
          price: updateProduct.price,
          quantity: updateProduct.quantity,
          info: updateProduct.info,
          supliarName: updateProduct.supliarName
        },
      };
      const result = await productCollection.updateOne(filter, updateDoc, options);
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
