const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// username = bigbazar
// password = oizxMIb2xPevh2cP

app.use(cors());
app.use(express.json());
require("dotenv").config();

// const verifyJwt = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: 'unauthorize access' });
//   }
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({message:'forbidden access'})
//     }
//       req.decoded = decoded
//   });
//   next();
// }

// const verifyToken = (token) => {
//   jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, function (err, decoded) {
//     let email;
//     if (err) {
//       email = "something wents wrong";
//     } else {
//       email = decoded;
//       return email;
//     }
//   });
// };

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
    const orderCollection = client.db("bigbazar").collection("order");
    app.post("/post", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send({ success: "success fully post" });
    });

    /// --------product list for inventory---------
    app.get("/productslist", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //-----------login token-----------------
    app.post("/login", (req, res) => {
      const email = req.body;
      const token = jwt.sign({email}, process.env.ACCESS_SECRET_TOKEN);
      res.send({ token });
    });

    // ----------- find one by id----------------
    app.get("/productslist/findone", async (req, res) => {
      const id = req.query.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const result = await orderCollection.findOne(filter).toArray();
      console.log(result);
      res.send(result);
    });

    // --------for homo page only 6 cards ----------
    app.get("/productslisthome", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.limit(6).toArray();
      res.send(result);
    });

    //---------- delete product--------------------
    app.delete("/delete/:productId", async (req, res) => {
      const productId = req.params.productId;
      const query = { _id: ObjectId(productId) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //-------update Product ----------
    app.put("/productupdate/:id", async (req, res) => {
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
          supliarName: updateProduct.supliarName,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //-------update order ----------
    app.put("/orderupdate/:id", async (req, res) => {
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
          supliarName: updateProduct.supliarName,
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // ----------- add order-----------
    app.post("/order", async (req, res) => {
      const order = req.body;
      // const orderinfo = req.headers.authorization;
      // const [email, tokenInfo] = orderinfo.split(" ");
      // console.log(email ,tokenInfo)
      // const decoded = jwt.verify(tokenInfo, process.env.ACCESS_SECRET_TOKEN);
      // if (decoded.email.email === email) {
        const result = await orderCollection.insertOne(order);
        res.send({ success: "success fully order" });
      // }
      // else {
      //    res.send({ success: "something wrong" });
      // }
    });

    // ------------ order list ---------
    app.get("/orderlist", async (req, res) => {
      const decodedEmail = req.decoded;
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // ------delete from order list-------
    app.delete("/orderdelete", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send("Successfully deleted one document.");
      } else {
        res.send("No documents matched the query. Deleted 0 documents.");
      }
    });
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
