import { Event } from "../model/EventModel.js";
import { Shop } from "../model/ShopModel.js";
import { uploadOnCloudinary } from "../utils/uploadToCloudinary.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      startDate,
      endDate,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !tags ||
      !originalPrice ||
      !discountPrice ||
      !stock ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required, including images",
      });
    }

    // Check if the shop exists
    const shop = await Shop.findById(req.shop._id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        msg: "Shop not found",
      });
    }

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "At least one image is required",
      });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const image of req.files) {
      const uploadedImage = await uploadOnCloudinary(image.path);
      if (uploadedImage?.secure_url) {
        uploadedImages.push({
          url: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
        });
      }
    }

    // Create the event
    const newEvent = await Event.create({
      title,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      shopId: shop._id,
      images: uploadedImages,
      startDate,
      endDate,
    });

    return res.status(200).json({
      success: true,
      msg: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.log("Error while creating event", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    if (!events || events.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No events found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.log("Error while fetching events", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        msg: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    console.log("Error while fetching event", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      startDate,
      endDate,
    } = req.body;

    // Check if the event exists
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        msg: "Event not found",
      });
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        startDate,
        endDate,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.log("Error while updating event", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the event exists
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        msg: "Event not found",
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      msg: "Event deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting event", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

export const shopAllEvents = async (req, res) => {
  try {
    const sellerId = req?.shop?._id;

    const events = await Event.find({ shopId: sellerId });

    if (!events || events.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No events found for this seller",
      });
    }

    return res.status(200).json({
      success: true,
      data: events,
      msg: "events fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching seller events", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};
