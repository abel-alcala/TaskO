import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    notes: { type: String, default: null },
    dueDate: { type: Date, default: null },
    completed: { type: Boolean, default: false },
    remindDate: { type: Date, default: null },
    taskID: { type: String, unique: true, required: true, index: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", null],
      default: null,
    },
    list: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
  },
  { timestamps: true },
);

const listSchema = new mongoose.Schema(
  {
    listID: { type: String, required: true, unique: true, index: true },
    listName: { type: String, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    color: { type: Number },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Use a valid email address"],
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
export const List = mongoose.model("List", listSchema);
export const Task = mongoose.model("Task", taskSchema);
