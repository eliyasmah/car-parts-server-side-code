const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4v8pr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("car_parts").collection("parts");
    const productReview = client.db("car_parts").collection("reviews");
    const productOrders = client.db("car_parts").collection("orders");

    app.post("/orders", async (req, res) => {
      const data = req.body;
      const result = await productOrders.insertOne(data);
      res.send(result);
    });

    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    //get
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = productReview.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = productOrders.find(query);
      const order = await cursor.toArray();
      res.send(order);
    });

    //POST
    app.post("/reviews", async (req, res) => {
      const newProduct = req.body;
      const result = await productReview.insertOne(newProduct);
      res.send(result);
    });

    app.post("/product/:id", async (req, res) => {
      const OrderProduct = req.body;
      const result = await productCollection.insertOne(OrderProduct);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From car parts");
});

app.listen(port, () => {
  console.log(`car parts listening on port ${port}`);
});
