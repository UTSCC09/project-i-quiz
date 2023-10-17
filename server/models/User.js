import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

const User = mongoose.model("User", UserSchema);
export default User;