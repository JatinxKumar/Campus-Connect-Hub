import Event from "../models/Event.js";

const removeMongooseMetadata = (obj) => {
  const newObj = obj.toObject();
  delete newObj._id;
  delete newObj.__v;
  return newObj;
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ events: events.map(removeMongooseMetadata) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const lastEvent = await Event.findOne().sort({ id: -1 });
    const nextId = lastEvent ? lastEvent.id + 1 : 1;
    
    const newEvent = new Event({
      ...req.body,
      id: nextId
    });
    
    const savedEvent = await newEvent.save();
    res.status(201).json({ event: removeMongooseMetadata(savedEvent) });
  } catch (err) {
    res.status(500).json({ message: "Failed to create event", error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { id: parseInt(id) },
      { $set: req.body },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ event: removeMongooseMetadata(updatedEvent) });
  } catch (err) {
    res.status(500).json({ message: "Failed to update event", error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findOneAndDelete({ id: parseInt(id) });
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event", error: err.message });
  }
};
