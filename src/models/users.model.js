const mongoose = require("mongoose");
const {
  ROLES,
  USER_ACTIVATION_STATUS,
  DOMAIN_VALUES,
  INDUSTRY_VALUES,
  URL_REGEX,
} = require("../config/constants");
const bcrypt = require("bcryptjs");

mongoose.connection.on("connected", async () => {
  // Check if the database is newly created
  const isFreshDatabase = mongoose.connection.readyState === 1;

  if (isFreshDatabase) {
    // Database is newly created, create the default user
    Users.findOne({ username: "admin" })
      .then(async (data) => {
        if (!data) {
          try {
            // Logic to create the default user in the 'users' collection
            const User = new Users({
              firstname: "super",
              lastname: "admin",
              username: "admin",
              password: bcrypt.hashSync("admin123", 8),
              emailId: "admin@example.com",
              role: ROLES.ADMIN,
            });
            await User.save();
            console.log("Admin user created successfully");
          } catch (error) {
            console.error("Error creating default user:", error);
          }
        }
      })
      .catch((error) => console.error("Error creating default user:", error));
  }
});

const ProfileSchema = new mongoose.Schema({
  profileSummary: String,
  linkedInUrl: String,
  yearsOfExperience: {
    type: Number,
    validate: {
      validator: function (value) {
        return value >= 0 && value <= 50;
      },
      message: "Experience must be between 0 and 50",
    },
  },
  domainOfExpertise: {
    type: [String],
    enum: DOMAIN_VALUES,
    required: true,
  },
  industry: {
    type: [String],
    enum: INDUSTRY_VALUES,
    required: true,
  },
  resume: {
    type: String,
    default: null,
    validate: [
      {
        validator: function (value) {
          if (this.role === ROLES.EXPERT && !value) {
            return false;
          }
          return true;
        },
        message: "Resume is required for experts",
      },
      {
        validator: function (value) {
          if (value && !URL_REGEX.test(value)) {
            return false;
          }
          return true;
        },
        message: "Resume must be a valid URL",
      },
    ],
  },
});

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: String,
    profile: {
      type: ProfileSchema,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
    },
    activationStatus: {
      status: {
        type: String,
        enum: Object.values(USER_ACTIVATION_STATUS),
      },
      message: String,
    },
    isActive: {
      type: Boolean,
    },
    otp: {
      type: String,
      deafult: null,
    },
    isOtpVerified: {
      type: String,
      defailt: false,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (!this.activationStatus.status) {
    switch (this.role) {
      case ROLES.EXPERT:
        this.activationStatus.status = USER_ACTIVATION_STATUS.PENDING;
        break;
      case ROLES.ADMIN:
      case ROLES.CUSTOMER:
        this.activationStatus.status = USER_ACTIVATION_STATUS.APPROVED;
        break;
      default:
        this.activationStatus.status = USER_ACTIVATION_STATUS.PENDING;
    }
  }

  if (!this.isActive) {
    switch (this.role) {
      case ROLES.EXPERT:
        this.isActive = false;
        break;
      default:
        this.isActive = true;
    }
  }
  next();
});

UserSchema.method("toJSON", function () {
  const { ...object } = this.toObject();

  object.fullname = object.firstname + " " + object.lastname;

  return object;
});

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
