import mongoose from "mongoose";

const functionalTestSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      unique: true,
    },

    // Acceleration Test (value could be numeric string like "2.44")
    rule189_37: { type: String, default: "NA" },
    // Speedometer Test (value could be numeric string like "1.23")
    rule189_4: { type: String, default: "NA" },

    // Completion flag
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const FunctionalTest = mongoose.model("FunctionalTest", functionalTestSchema);
export default FunctionalTest;
