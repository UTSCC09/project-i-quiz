import dotenv from "dotenv";

// Get environment variables
dotenv.config();

const formatMessage = (success, message, payload = null, error = null) => {
  let messageObj = {
    "success": success,
    "message": message
  };

  if (payload) { messageObj["payload"] = payload; } 
  if (error && process.env.NODE_ENV === "development") { messageObj["error"] = error; }

  return messageObj;
}

export default formatMessage;