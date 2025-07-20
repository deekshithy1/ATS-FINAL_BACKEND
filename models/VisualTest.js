import mongoose from "mongoose";

const enumValues = ["P", "F", "NA"];

const visualTestSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      unique: true,
    },
        // Completion flag
    isCompleted: { type: Boolean, default: false },

    // Add all visual rule fields (from PDF)
    rule189_3i: { type: String, enum: enumValues, default: "NA" },
    rule189_7_Visual: { type: String, enum: enumValues, default: "NA" },
    rule189_8a: { type: String, enum: enumValues, default: "NA" },
    rule189_8b: { type: String, enum: enumValues, default: "NA" },
    rule189_9a: { type: String, enum: enumValues, default: "NA" },
    rule189_9b: { type: String, enum: enumValues, default: "NA" },
    rule189_10: { type: String, enum: enumValues, default: "NA" },
    rule189_11a: { type: String, enum: enumValues, default: "NA" },
    rule189_11b: { type: String, enum: enumValues, default: "NA" },
    rule189_11c: { type: String, enum: enumValues, default: "NA" },
    rule189_11d: { type: String, enum: enumValues, default: "NA" },
    rule189_11e: { type: String, enum: enumValues, default: "NA" },
    rule189_12a: { type: String, enum: enumValues, default: "NA" },
    rule189_12b: { type: String, enum: enumValues, default: "NA" },
    rule189_12a_Visual: { type: String, enum: enumValues, default: "NA" },
    rule189_12b_Visual: { type: String, enum: enumValues, default: "NA" },
    rule189_13: { type: String, enum: enumValues, default: "NA" },
    rule189_14: { type: String, enum: enumValues, default: "NA" },
    rule189_15: { type: String, enum: enumValues, default: "NA" },
    rule189_16_Visual: { type: String, enum: enumValues, default: "NA" },
    rule189_17a: { type: String, enum: enumValues, default: "NA" },
    rule189_17b: { type: String, enum: enumValues, default: "NA" },
    rule189_19: { type: String, enum: enumValues, default: "NA" },
    rule189_20: { type: String, enum: enumValues, default: "NA" },
    rule189_22: { type: String, enum: enumValues, default: "NA" },
    rule189_23: { type: String, enum: enumValues, default: "NA" },
    rule189_24: { type: String, enum: enumValues, default: "NA" },
    rule189_25: { type: String, enum: enumValues, default: "NA" },
    rule189_26: { type: String, enum: enumValues, default: "NA" },
    rule189_27: { type: String, enum: enumValues, default: "NA" },
    rule189_27_Visual: { type: String, enum: enumValues, default: "NA" },
    rule189_28: { type: String, enum: enumValues, default: "NA" },
    rule189_29: { type: String, enum: enumValues, default: "NA" },
    rule189_30: { type: String, enum: enumValues, default: "NA" },
    rule189_31_Visual: { type: String, enum: enumValues, default: "NA" },
    rule189_32: { type: String, enum: enumValues, default: "NA" },
    rule189_33: { type: String, enum: enumValues, default: "NA" },
    rule189_34: { type: String, enum: enumValues, default: "NA" },
    rule189_34_Visual: { type: String, enum: enumValues, default: "NA" },
    rule189_35a: { type: String, enum: enumValues, default: "NA" },
    rule189_35b: { type: String, enum: enumValues, default: "NA" },
    rule189_35c: { type: String, enum: enumValues, default: "NA" },
    rule189_35d: { type: String, enum: enumValues, default: "NA" },
    rule189_36: { type: String, enum: enumValues, default: "NA" },
    rule189_37_Visual: { type: String, enum: enumValues, default: "NA" },
    rule189_38: { type: String, enum: enumValues, default: "NA" },
    rule189_39: { type: String, enum: enumValues, default: "NA" },


  },
  { timestamps: true }
);

const VisualTest = mongoose.model("VisualTest", visualTestSchema);
export default VisualTest;
