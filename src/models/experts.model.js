const mongoose = require("mongoose");

const ExpertsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Users',
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
