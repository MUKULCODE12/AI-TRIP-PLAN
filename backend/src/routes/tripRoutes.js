const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  const trips = await prisma.trip.findMany();

  res.json(trips);
});

router.post("/", async (req, res) => {
  try {
   const { tripId, tripData } = req.body;

const trip = await prisma.trip.create({
  data: {
    tripId,
    tripData,
  },
});
    res.status(201).json(trip);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create trip",
    });
  }
});

router.get("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: {
        tripId,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json(trip);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trip",
    });
  }
});

router.put("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const { tripData } = req.body;

    const updatedTrip = await prisma.trip.update({
      where: {
        tripId,
      },
      data: {
        tripData,
      },
    });

    res.json(updatedTrip);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update trip",
    });
  }
});

router.delete("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    await prisma.trip.delete({
      where: {
        tripId,
      },
    });

    res.json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete trip",
    });
  }
});

router.get("/:tripId", async (req, res) => {
  const trip = await prisma.trip.findUnique({
    where: {
      tripId: req.params.tripId,
    },
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found",
    });
  }

  res.json(trip);
});

module.exports = router;