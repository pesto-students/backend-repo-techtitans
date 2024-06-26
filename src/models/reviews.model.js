const mongoose = require("mongoose");
const {
  REVIEW_STATUS,
  DOMAIN_VALUES,
  URL_REGEX,
} = require("../config/constants");
const { v4: uuidv4 } = require("uuid");

const HighlightAreaSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  height: {
    type: Number,
    required: true,
  },
  left: {
    type: Number,
    required: true,
  },
  pageIndex: {
    type: Number,
    required: true,
  },
  top: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
});

const CommentsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    commenterId: {
      type: String,
      ref: "Users",
      required: true,
    },
    orderId: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    highlightAreas: [HighlightAreaSchema],
    quote: {
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

const ReviewSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    docId: {
      type: String,
      required: true,
      unique: true,
    },
    attachmentName: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          if (value && !URL_REGEX.test(value)) {
            return false;
          }
          return true;
        },
        message: "Document must be a valid URL",
      },
    },
    relevantExp: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 50;
        },
        message: "Experience must be between 0 and 50",
      },
    },
    reasonForReview: {
      type: String,
    },
    description: {
      type: String,
    },
    docType: {
      type: String,
      required: true,
      enum: {
        values: DOMAIN_VALUES,
        message: "{VALUE} is not a valid document type", // Custom error message
      },
    },
    reviewStatus: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
    },
    reviewerId: {
      type: String,
      ref: "Users",
      required: true,
      default: null,
    },
    // reviewerDetails: {
    //   type: Users.schema,
    //   required: false,
    //   default: null,
    // },
    reviewerUsername: {
      type: String,
      required: true,
    },
    comments: [CommentsSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      ref: "Users",
      required: true,
    },
    updatedBy: {
      type: String,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", ReviewSchema);

module.exports = Reviews;
