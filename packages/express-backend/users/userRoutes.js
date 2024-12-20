import express from "express";
import { User, List, Task } from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (decoded) {
        req.body["userName"] = decoded.userName;
        next();
      } else {
        console.log("JWT error:", error);
        res.status(401).end();
      }
    });
  }
};

export const generateAccessToken = (username) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userName: username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          console.log("Error generating token:", error);
          reject(error);
        } else {
          resolve(token);
        }
      },
    );
  });
};

//login
router.post("/login", async (req, res) => {

    const { userName, password } = req.body;
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ userName });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = await generateAccessToken(userName);
    res.json({ userName: user.userName, token });

});

// all users
router.get("/users", async (req, res) => {
    const users = await User.find().select("-password").populate("lists");
    res.json(users);
});

//createAccount
router.post("/register", async (req, res) => {

    const { firstName, lastName, email, userName, password } = req.body;
    if (!email || !userName || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingUser = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === req.body.email
            ? "Email already exists"
            : "Username already taken",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      userName,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      lists: [],
    };
    const userResponse = await User.create(user);
    const token = await generateAccessToken(userName);
    userResponse.toObject();
    delete userResponse.password;
    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
      token,
    });

});

//getList
router.get("/users/:userName/lists", authenticateUser, async (req, res) => {

    const user = await User.findOne({ userName: req.params.userName }).populate(
      {
        path: "lists",
        populate: { path: "tasks" },
      },
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.lists || []);
});

//createLists
router.post("/users/:userName/lists", authenticateUser, async (req, res) => {

    const user = await User.findOne({ userName: req.params.userName });
    if (!user) return res.status(404).json({ message: "User not found" });

    const list = await List.create({
      ...req.body,
      createdBy: user._id,
    });

    await User.findByIdAndUpdate(user._id, { $push: { lists: list._id } });
    res.status(201).json(list);
});

// Delete a list
router.delete(
  "/users/:userName/lists/:listId",
  authenticateUser,
  async (req, res) => {
      const list = await List.findOneAndDelete({ listID: req.params.listId });
      if (!list) return res.status(404).json({ message: "List not found" });

      await User.findByIdAndUpdate(list.createdBy, {
        $pull: { lists: list._id },
      });
      await Task.deleteMany({ list: list._id });
      res.status(200).json({ message: "List and associated tasks deleted" });
  },
);

//getTasks
router.get(
  "/users/:userName/lists/:listId/tasks",
  authenticateUser,
  async (req, res) => {
      const list = await List.findOne({ listID: req.params.listId }).populate(
        "tasks",
      );
      if (!list) return res.status(404).json({ message: "List not found" });
      res.json(list.tasks);
  },
);

//createTasks
router.post(
  "/users/:userName/lists/:listId/tasks",
  authenticateUser,
  async (req, res) => {
      const list = await List.findOne({ listID: req.params.listId }).populate(
        "createdBy",
      );
      if (!list) return res.status(404).json({ message: "List not found" });

      if (list.createdBy.userName !== req.params.userName) {
        return res
          .status(403)
          .json({ message: "Unauthorized to add tasks to this list" });
      }

      const { taskName, notes, dueDate, completed, remindDate, priority } =
        req.body;
      const task = await Task.create({
        taskName,
        notes: notes || null,
        dueDate: dueDate || null,
        completed: completed || false,
        remindDate: remindDate || null,
        priority: priority || null,
        taskID: crypto.randomUUID(),
        list: list._id,
      });

      list.tasks.push(task._id);
      await list.save();

      res.status(201).json(task);
  },
);

//updateTask
router.put(
  "/users/:userName/lists/:listId/tasks/:taskId",
  authenticateUser,
  async (req, res) => {
      const updates = req.body;
      const task = await Task.findOneAndUpdate(
        { taskID: req.params.taskId },
        updates,
        { new: true, runValidators: true },
      );
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.json(task);
  },
);

//deleteTask
router.delete(
  "/users/:userName/lists/:listId/tasks/:taskId",
  authenticateUser,
  async (req, res) => {
      const task = await Task.findOneAndDelete({ taskID: req.params.taskId });
      if (!task) return res.status(404).json({ message: "Task not found" });

      await List.findByIdAndUpdate(task.list, { $pull: { tasks: task._id } });
      res.status(200).json({ message: "tasks deleted" });
  },
);

//updateList not an Api Call yet
router.put(
  "/users/:userName/lists/:listId",
  authenticateUser,
  async (req, res) => {
      const list = await List.findOneAndUpdate(
        { listID: req.params.listId },
        req.body,
        { new: true },
      );
      if (!list) return res.status(404).json({ message: "List not found" });
      res.json(list);
  },
);

// users
router.get("/users/:userName", authenticateUser, async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })
      .select("-password")
      .populate("lists");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

export default router;
