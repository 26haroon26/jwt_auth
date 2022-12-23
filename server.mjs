import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { stringToHash, validateHash, varifyHash } from "bcrypt-inzi";
// bcrypt-nodejs real liabrary he bcrypt-inzi us pr ek wrapper he complete liabrary nahi

const SECRET = process.env.SECRET || "topsceret";
const port = process.env.PORT || 4000;
const mongodbURI =
  process.env.mongodbURI ||
  "mongodb+srv://abc:abc@cluster0.qgyid76.mongodb.net/logindata?retryWrites=true&w=majority";
const app = express();
app.use(cors());
// jb server alg url pr ho or frontend alg url pr ho to cors lgate hen w
// app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());
const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model("Users", userSchema);

let productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  createdOn: { type: Date, default: Date.now },
});
// line 22 name find krne keley kia he agr sare string pr krna ho to   productSchema.index({"$**":"text"}) lgaen ge
// productSchema.index({name:"text"})
const productModel = mongoose.model("products", productSchema);

// for signup

app.post("/signup", (req, res) => {
  let body = req.body;

  if (!body.firstName || !body.lastName || !body.email || !body.password) {
    res.status(400).send(
      `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
    );
    return;
  }

  req.body.email = req.body.email.toLowerCase();

  // check if user already exist // query email user
  userModel.findOne({ email: body.email }, (err, data) => {
    //error me null ya object asakhta he
    if (!err) {
      console.log("data: ", data);

      if (data) {
        // user already exist
        console.log("user already exist: ", data);
        res.status(400).send({
          message: "user already exist,, please try a different email",
        });
        return;
      } else {
        // user not already exist
        // bcrypt hash technique isley ke ye one incryption he
        stringToHash(body.password).then((hashString) => {
          userModel.create(
            {
              firstName: body.firstName,
              lastName: body.lastName,
              email: body.email,
              password: hashString,
            },
            (err, result) => {
              if (!err) {
                console.log("data saved: ", result);
                res.status(201).send({ message: "user is created" });
              } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "internal server error" });
              }
            }
          );
        });
      }
    } else {
      console.log("db error: ", err);
      res.status(500).send({ message: "db error in query" });
      return;
    }
  });
});

// for Login

app.post("/login", (req, res) => {
  let body = req.body;

  if (!body.email || !body.password) {
    // null check - undefined, "", 0 , false, null , NaN
    res.status(400).send(
      `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
    );
    return;
  }
  req.body.email = req.body.email.toLowerCase();

  // check if user already exist // query email user
  userModel.findOne(
    { email: body.email },
    //jitne items ke need ho yo manga sakhte hen  dono trh likh sakhte hen { email:1, firstName:1, lastName:1, password:0 },
    "email firstName lastName password",
    (err, data) => {
      if (!err) {
        console.log("data: ", data);

        if (data) {
          // user found
          varifyHash(body.password, data.password).then((isMatched) => {
            console.log("isMatched: ", isMatched);

            if (isMatched) {
              var token = jwt.sign(
                {
                  //ye payload he
                  //token me id is lye de he ke bad me querry na chalene prhee
                  _id: data._id,
                  email: data.email,
                  //issue date -30 is lye kya he quen ke agr koi issue krte he request kre to reject ho gae ge is lye 30 seconf=d ko minus krdya
                  iat: Math.floor(Date.now() / 1000) - 30,
                  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                },
                SECRET
              );
              //ab token me ek sign ajae ga

              //express ke documentation me ye cookie wala code he
              res.cookie("Token", token, {
                //maxAge : 86,400,000 same he is ka mtlb 24 yours he is maxage ke expire hote he browser is ko remove krdega
                maxAge: 86_400_000,
                //httponly secure he or javascript se accesable nahi
                httpOnly: true,
              });

              res.send({
                message: "login successful",
                profile: {
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  _id: data._id,
                },
              });
              return;
            } else {
              console.log("user not found");
              res.status(401).send({ message: "Incorrect email or password" });
              return;
            }
          });
        } else {
          // user not already exist
          console.log("user not found");
          res.status(401).send({ message: "Incorrect email or password" });
          return;
        }
      } else {
        console.log("db error: ", err);
        res.status(500).send({ message: "login failed, please try later" });
        return;
      }
    }
  );
});

// for Logout
app.post("/logout", (req, res) => {
  res.cookie("Token", "", {
    maxAge: 1,
    httpOnly: true,
  });

  res.send({ message: "Logout successful" });
});

// for routes checking as a bariar

app.use((req, res, next) => {
  if (!req?.cookies?.Token) {
    res.status(401).send({
      message: "include http-only credentials with every request",
    });
    return;
  }
  jwt.verify(req.cookies.Token, SECRET, (err, decodedData) => {
    if (!err) {
      console.log("decodedData: ", decodedData);

      const nowDate = new Date().getTime() / 1000;

      if (decodedData.exp < nowDate) {
        res.status(401).send({ message: "token expired" });
        res.cookie("Token", "", {
          maxAge: 1,
          httpOnly: true,
        });
      } else {
        console.log("token approved");

        req.body.token = decodedData;
        next();
        // next call krne ke wjah se request age barh jae ge
      }
    } else {
      res.status(401).send("invalid token");
    }
  });
});

app.post("/product", (req, res) => {
  const body = req.body;

  if (
    // validation
    !body.name ||
    !body.price ||
    !body.description
  ) {
    res.status(400).send({
      message: "required parameters missing",
    });
    return;
  }

  console.log(body.name);
  console.log(body.price);
  console.log(body.description);

  productModel.create(
    {
      name: body.name,
      price: body.price,
      description: body.description,
    },
    (err, saved) => {
      if (!err) {
        console.log(saved);

        res.send({
          message: "product added successfully",
        });
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    }
  );
});

app.get("/products", (req, res) => {
  productModel.find({}, (err, data) => {
    if (!err) {
      res.send({
        message: "got all products successfully",
        data: data,
      });
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});
// id pr 1 product ka data mangane keley

// app.get("/product/:id", (req, res) => {
//   const id = req.params.id;

//   productModel.findOne({ _id: id }, (err, data) => {
//     if (!err) {
//       if (data) {
//         res.send({
//           message: `get product by id: ${data._id} success`,
//           data: data,
//         });
//       } else {
//         res.status(404).send({
//           message: "product not found",
//         });
//       }
//     } else {
//       res.status(500).send({
//         message: "server error",
//       });
//     }
//   });
// });

// name find krne keley

app.get("/product/:name", (req, res) => {
  console.log(req.params.name);
  const querryName = req.params.name;
  productModel.find({ name: { $regex: `${querryName}` } }, (err, data) => {
    if (!err) {
      if (data) {
        res.send({
          message: `get product by success`,
          data: data,
        });
      } else {
        res.status(404).send({
          message: "product not found",
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});
app.delete("/product/:id", (req, res) => {
  const id = req.params.id;

  productModel.deleteOne({ _id: id }, (err, deletedData) => {
    console.log("deleted: ", deletedData);
    if (!err) {
      if (deletedData.deletedCount !== 0) {
        res.send({
          message: "Product has been deleted successfully",
        });
      } else {
        res.status(404);
        res.send({
          message: "No Product found with this id: " + id,
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});
app.put("/product/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  if (!body.name || !body.price || !body.description) {
    // is trh jo api response message de ius ko self document api kehte hen
    res.status(400).send(` required parameter missing. example request body:
      {
          "name": "value",
          "price": "value",
          "description": "value"
      }`);
    return;
  }

  try {
    let data = await productModel
      .findByIdAndUpdate(
        id,
        {
          name: body.name,
          price: body.price,
          description: body.description,
        },
        { new: true }
      )
      .exec();

    console.log("updated: ", data);

    res.send({
      message: "product modified successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "server error",
    });
  }
});

const __dirname = path.resolve();
app.use("/", express.static(path.join(__dirname, "./web/build")));
app.use("*", express.static(path.join(__dirname, "./web/build")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
mongoose.set('strictQuery', false);
mongoose.connect(mongodbURI);

mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
