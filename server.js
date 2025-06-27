const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const mongoURL = 'mongodb+srv://toratitejaswini:K4KMUmncJ3yUVBzd@cluster0.7suvmn4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';;

mongoose.connect(mongoURL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("DB connection error:", err));

// Mongoose schema and model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const Item = mongoose.model('Item', itemSchema);

// 🔽 ROUTES 🔽

// GET all items
let items = [{id:1,name:"Rishi"},
    {id:2, name:"Vyshu"},
    {id:3, name:"Indhu"}
];
app.get('/items/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST new item
app.post('/items/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const newItem = new Item({ name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

// DELETE item by ID
app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// PUT (Update) item by ID
app.put('/items/:id', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
