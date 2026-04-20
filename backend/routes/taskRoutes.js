import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = express.Router();


// ✅ CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      creator: req.user.id,
      assignedTo: assignedTo || null,
    });

    res.json(task);
  } catch (err) {
    console.log("CREATE TASK ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ GET TASKS
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { creator: req.user.id },
        { assignedTo: req.user.id },
      ],
    }).populate("creator assignedTo");

    res.json(tasks);
  } catch (err) {
    console.log("FETCH TASK ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ UPDATE TASK
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // ASSIGNED USER → only status
    if (task.assignedTo?.toString() === req.user.id) {
      task.status = req.body.status || task.status;
    }

    // CREATOR → edit details
    else if (task.creator.toString() === req.user.id) {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.dueDate = req.body.dueDate || task.dueDate;
    }

    else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await task.save();
    res.json(task);
  } catch (err) {
    console.log("UPDATE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only creator can delete" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.log("DELETE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;