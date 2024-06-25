const { string } = require("joi");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserTokenSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      ref: "Users",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserTokens = mongoose.model("UserTokens", UserTokenSchema);

module.exports = UserTokens;
