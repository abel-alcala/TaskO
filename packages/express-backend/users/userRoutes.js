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
    return res.status(401).end();
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      console.log("JWT error:", error);
      res.status(401).end();
    }
  });
};

//login
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userName: userName }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ ...userResponse, token });
  } catch  {
    res.status(500).json({ message: "Error logging in" });
  }
});

// all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("lists");
    res.json(users);
  } catch  {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
    });
  }
});

//register user
router.post("/users", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === req.body.email
            ? "Email already exists"
            : "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      list: [],
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch  {
    res.status(500).json({ message: "Error creating user" });
  }
});

// users
router.get("/users/:userName", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName })
      .select("-password")
      .populate("lists");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch  {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// lists
router.post("/users/:userName/lists", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName });
    if (!user) return res.status(404).json({ message: "User not found" });

    const list = await List.create({
      ...req.body,
      createdBy: user._id,
    });

    await User.findByIdAndUpdate(user._id, { $push: { lists: list._id } });
    res.status(201).json(list);
  } catch  {
    res.status(500).json({ message: "Error creating list" });
  }
});

router.get("/users/:userName/lists", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName }).populate(
      {
        path: "lists",
        populate: { path: "tasks" },
      },
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.lists || []);
  } catch  {
    res.status(500).json({ message: "Error fetching lists" });
  }
});

// tasks
router.post(
  "/users/:userName/lists/:listId/tasks",
  authenticateUser,
  async (req, res) => {
    try {
      const list = await List.findOne({ listID: req.params.listId });
      if (!list) return res.status(404).json({ message: "List not found" });

      const task = await Task.create({
        ...req.body,
        list: list._id,
      });

      await List.findByIdAndUpdate(list._id, { $push: { tasks: task._id } });
      res.status(201).json(task);
    } catch  {
      res.status(500).json({ message: "Error creating task" });
    }
  },
);

router.get(
  "/users/:userName/lists/:listId/tasks",
  authenticateUser,
  async (req, res) => {
    try {
      const list = await List.findOne({ listID: req.params.listId }).populate(
        "tasks",
      );
      if (!list) return res.status(404).json({ message: "List not found" });
      res.json(list.tasks);
    } catch  {
      res.status(500).json({ message: "Error fetching tasks" });
    }
  },
);

router.put(
  "/users/:userName/lists/:listId",
  authenticateUser,
  async (req, res) => {
    try {
      const list = await List.findOneAndUpdate(
        { listID: req.params.listId },
        req.body,
        { new: true },
      );
      if (!list) return res.status(404).json({ message: "List not found" });
      res.json(list);
    } catch  {
      res.status(500).json({ message: "Error updating list" });
    }
  },
);

router.put(
  "/users/:userName/lists/:listId/tasks/:taskId",
  authenticateUser,
  async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { taskID: req.params.taskId },
        req.body,
        { new: true },
      );
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.json(task);
    } catch  {
      res.status(500).json({ message: "Error updating task" });
    }
  },
);

router.delete(
  "/users/:userName/lists/:listId",
  authenticateUser,
  async (req, res) => {
    try {
      const list = await List.findOneAndDelete({ listID: req.params.listId });
      if (!list) return res.status(404).json({ message: "List not found" });

      await User.findByIdAndUpdate(list.createdBy, {
        $pull: { lists: list._id },
      });

      await Task.deleteMany({ list: list._id });
      res.json({ message: "List and associated tasks deleted" });
    } catch  {
      res.status(500).json({ message: "Error deleting list" });
    }
  },
);

router.delete(
  "/users/:userName/lists/:listId/tasks/:taskId",
  authenticateUser,
  async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({ taskID: req.params.taskId });
      if (!task) return res.status(404).json({ message: "Task not found" });

      await List.findByIdAndUpdate(task.list, {
        $pull: { tasks: task._id },
      });
      res.json({ message: "Task deleted" });
    } catch  {
      res.status(500).json({ message: "Error deleting task" });
    }
  },
);

export default router;
