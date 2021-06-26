const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId =require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5005;

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y1wap.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const blogList = client.db("BlogSide").collection("Blog");
    const adminList = client.db("BlogSide").collection("MakeAdmin");
    const shopList = client.db("BlogSide").collection("ShopList");

    app.get('/blogs',(req,res)=>{
        blogList.find()
        .toArray((err,items)=>{
            res.send(items);
        })
    })

    app.post('/addBlog', (req, res) => {
        const newBlog = req.body;
        blogList.insertOne(newBlog)
            .then(result => {
                console.log('insurt', result.insertedCount > 0)
                res.send(result.insertedCount > 0)
            })

    })

    app.delete('/delete/:id',(req,res)=>{
        blogList.deleteOne({_id: ObjectId(req.params.id)})
        .then(result=>{
           res.send(result.deletedCount>0);
        })
    })
// -------------------------------adminList--------------

    app.post('/adminEmail', (req, res) => {
        const admin = req.body;
        adminList.insertOne(admin)
          .then(result => {
            res.send(result.insertedCount > 0);
          })
    
      });
    
    
    
      app.get('/isAdmin', (req, res) => {
        const email=req.query.email;
        adminList.find({ email: email })
          .toArray((err, documents) => {
            // const e=documents[0].email;
            
            // res.send(e);
            // res.send(documents[0]?.email)
    
              res.send(documents);
              
                
          })
      })
    
// ----------------------------shop------------------
      app.get('/product',(req,res)=>{
        shopList.find()
        .toArray((err,items)=>{
            res.send(items);
        })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct= req.body;
        shopList.insertOne(newProduct)
            .then(result => {
                console.log('insurt', result.insertedCount > 0)
                res.send(result.insertedCount > 0)
            })

    })

 

});

// client.connect(err => {
//     const orderBooks = client.db("bookShop").collection("bookOrder");
//     app.post('/bookOrder',(req,res)=>{
//         const bookOrder=req.body;
//         orderBooks.insertOne(bookOrder)
//         .then(result=>{
//             res.send(result.insertedCount>0);
//         })
//         console.log(bookOrder);
//     })

//     app.get('/allOrder',(req,res)=>{
//         // console.log(req.query.email);
//         orderBooks.find({email:req.query.email})
//         .toArray((err,documents)=>{
//             res.send(documents);
//         })
//     })
//   });




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})