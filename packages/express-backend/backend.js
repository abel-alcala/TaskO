import express from "express";
import cors from "cors";

// mongoose stuff
// import mongoose from "mongoose";
// import userRoutes from "./user.js"
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/users", {
//   useNewUrlParser: true,
// });
// app.use("/users", userRoutes);

// const users = {
//   users_list: [
//     {
//       id: "xyz789",
//       name: "Charlie",
//       job: "Janitor",
//     },
//     {
//       id: "abc123",
//       name: "Mac",
//       job: "Bouncer",
//     },
//     {
//       id: "ppp222",
//       name: "Mac",
//       job: "Professor",
//     },
//     {
//       id: "yat999",
//       name: "Dee",
//       job: "Aspring actress",
//     },
//     {
//       id: "zap555",
//       name: "Dennis",
//       job: "Bartender",
//     },
//     {
//       id: "qwe123",
//       job: "Zookeeper",
//       name: "Cindy",
//     },
//   ],
// };


// get all users - filter by name and job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userServices
    .getUsers(name, job)
    .then((result) => res.send({ users_list: result }))
    .catch(() => res.status(404).send("User not found"));
    
  // let filterUser = users["users_list"];

  // if (name) {
  //   filterUser = filterUser.filter((user) => user.name === name);
  // }

  // if (job) {
  //   filterUser = filterUser.filter((user) => user.job === job);
  // }

  // if (filterUser.length > 0) {
  //   res.send({ users_list: filterUser });
  // } else {
  //   res.status(404).send("User not found");
  // }

  // try {
  //   const users = await userServices.getUsers(name, job);
  //   if (users.length > 0){
  //     res.status(200).send({users_list: users});
  //   }else{
  //     res.status(404).send("No users found");
  //   }
  // } catch(error){
  //   res.status(500).send("Error fetching users: " + error.message);
  // }

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

  // const id = req.params["id"];

  // const userToDelete = findUserById(id);

  // if (userToDelete) {
  //   const index = users.users_list.indexOf(userToDelete); //get
  //   users.users_list.splice(index, 1); //remove user from array
  //   res.status(204).send("Successfully deleted");
  // } else {
  //   res.status(404).send("User not found");
  // }

  // try {
  // const deleteUsers = await userServices.findUserbyIdAndDelete(id);
  // if (deleteUsers){
  //   res.status(204).send("User deleted");
  // }else{
  //   res.status(404).send("No users found");
  // }
  // } catch(error){
  //   res.status(500).send("Error fetching users: " + error.message);
  // }
});

// add a new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices
    .addUser(userToAdd)
    .then((userAdded) => res.status(201).send(userAdded))
    .catch((error) => res.status(500).send("Error fetching users: " + error.message));

  // userToAdd.id = Math.floor(Math.random() * 10000).toString();
  // addUser(userToAdd);
  // res.status(201).send(userToAdd);

//   try {
//   const newUsers = await userServices.addUser(user);
//   res.status(201).send({new_users_list: newUsers});
// } catch(error){
//   res.status(500).send("Error fetching users: " + error.message);
// }
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

  // const id = req.params["id"]; //or req.params.id

  // let result = findUserById(id);
  // if (result === undefined) {
  //   res.status(404).send("Resource not found.");
  // } else {
  //   res.send(result);
  // }

  // try {
  //   const user = await userServices.findUserById(id);
  //   if (users.length > 0){
  //     res.status(200).send({users_list: users});
  //   }else{
  //     res.status(404).send("No users found");
  //   }
  // } catch(error){
  //   res.status(500).send("Error fetching users: " + error.message);
  // }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


