const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ExpertsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      ref: "Users",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    assigned: {
      type: Number,
      required: true,
      default: 0,
    },
    submitted: {
      type: Number,
      required: true,
      default: 0,
    },
    pending: {
      type: Number,
      requied: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ExpertsSchema.pre("save", (next) => {
  this.pending = this.assigned - this.submitted;
  next();
});


const Experts = mongoose.model("Experts", ExpertsSchema);

module.exports = Experts;
