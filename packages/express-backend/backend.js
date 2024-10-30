import express from "express";
import cors from "cors";

// mongoose stuff
import mongoose from "mongoose";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));


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


