import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
  code: {
    type: String,
    default: null
  },
  createdAt: {
    type: Number,
    default: null
  },
  attemptsMade: {
    type: Number,
    default: 0
  }
});

const UserSchema = new mongoose.Schema({
  type : {
    type: String,
    enum: ["student", "instructor"],
    default: "student"
  },
  firstName: {
    type: String,
    required: [true, "Please provide a first name"]
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name"]
  },
  email: {
    type: String,
    required: [true, "Please provide an email address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"]
  },
  courses: [{ 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    accentColor: String,
    archived: { type: Boolean, default: false }
  }],
  emailVerificationCode: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  passwordReset: {
    type: PasswordResetSchema,
    required: true
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
