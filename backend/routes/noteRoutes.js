
const express = require("express");
const mongoose = require("mongoose");

const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE NOTE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120) {
      return res.status(400).json({
        message: "Title must be between 3 and 120 characters",
      });
    }

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        message: "Content must be a non-empty string",
      });
    }

    if (tags !== undefined && (
      !Array.isArray(tags) ||
      !tags.every(tag => typeof tag === "string")
    )) {
      return res.status(400).json({
        message: "Tags must be an array of strings",
      });
    }

    // Create note
    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      tags: tags ? tags.map(tag => tag.trim()).filter(Boolean) : [],
      owner: req.userId,
    });

    res.status(201).json({
      message: "Note created successfully",
      data: note,
    });

  } catch (error) {
    console.error("Create note error:", error.message);

    res.status(500).json({
      message: "Server error while creating note",
    });
  }
});


 // GET NOTES WITH SEARCH, TAG FILTER AND PAGINATION
router.get("/", authMiddleware, async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      tag,
    } = req.query;

    // Validate pagination
    const currentPage = Number(page);
    const pageLimit = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(pageLimit) ||
      currentPage < 1 ||
      pageLimit < 1 ||
      pageLimit > 100
    ) {
      return res.status(400).json({
        message: "Invalid page or limit",
      });
    }

    // Build filter
    const filter = {};

    // Normal users see only their own notes
    // Admins can see all notes
    if (req.userRole !== "admin") {
      filter.owner = req.userId;
    }

    // Search title or content
    if (search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
      ];
    }

    // Filter by tag
    if (tag && tag.trim()) {
      filter.tags = tag.trim();
    }

    // Count matching notes
    const total = await Note.countDocuments(filter);

    // Calculate pagination
    const pages = Math.ceil(total / pageLimit);
    const skip = (currentPage - 1) * pageLimit;

    // Fetch notes
    const notes = await Note.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    res.status(200).json({
      message: "Notes fetched successfully",
      data: notes,
      page: currentPage,
      total,
      pages,
    });

  } catch (error) {
    console.error("Get notes error:", error.message);

    res.status(500).json({
      message: "Server error while fetching notes",
    });
  }
});


// UPDATE NOTE
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    // Find note
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Only the owner can update
    if (note.owner.toString() !== req.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this note",
      });
    }

    // Validate title
    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        title.trim().length < 3 ||
        title.trim().length > 120
      ) {
        return res.status(400).json({
          message: "Title must be between 3 and 120 characters",
        });
      }

      note.title = title.trim();
    }

    // Validate content
    if (content !== undefined) {
      if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
          message: "Content must be a non-empty string",
        });
      }

      note.content = content.trim();
    }

    // Validate tags
    if (tags !== undefined) {
      if (
        !Array.isArray(tags) ||
        !tags.every(tag => typeof tag === "string")
      ) {
        return res.status(400).json({
          message: "Tags must be an array of strings",
        });
      }

      note.tags = tags.map(tag => tag.trim()).filter(Boolean);
    }

    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      data: note,
    });

  } catch (error) {
    console.error("Update note error:", error.message);

    res.status(500).json({
      message: "Server error while updating note",
    });
  }
});


// DELETE NOTE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    // Find note
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Check permissions
    const isOwner = note.owner.toString() === req.userId;
    const isAdmin = req.userRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this note",
      });
    }

    // Delete note
    await Note.findByIdAndDelete(id);

    res.status(200).json({
      message: "Note deleted successfully",
    });

  } catch (error) {
    console.error("Delete note error:", error.message);

    res.status(500).json({
      message: "Server error while deleting note",
    });
  }
});


module.exports = router;
