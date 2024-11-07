import express from "express";
import cors from "cors";

// mongoose stuff
import mongoose from "mongoose";
import userServices from "./user-services.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 8000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Connection error", error));


app.use(cors());
app.use(express.json());

// Root route to test if the server is working
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// get all users - filter by name and job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userServices
    .getUsers(name, job)
    .then((result) => res.send({ users_list: result }))
    .catch(() => res.status(404).send("User not found"));

});

// delete user by ID
app.delete("/users/:id", (req, res) => {
  userServices
    .findUserbyIdAndDelete(req.params.id)
    .then((result) => {
      if (result){
        res.status(204).send();
      } else{
        res.status(404).send("No users found");
      }
      
    })
    .catch(() => res.status(404).send("No users found"));
});

// add a new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices
    .addUser(userToAdd)
    .then((userAdded) => res.status(201).send(userAdded))
    .catch((error) => res.status(500).send("Error fetching users: " + error.message));

});


// get user by ID
app.get("/users/:id", (req, res) => {
  userServices
    .findUserById(req.params.id)
    .then((userAdded) => {
      if (userAdded){
        res.send(userAdded);
      } else{
        res.status(404).send("User not found");
      }
    })
    .catch(() => res.status(404).send("No users found"));

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


