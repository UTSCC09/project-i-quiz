
const formatMessage = (success, message, payload) => {
  if (!payload) return {"success": success, "message": message};
  return {"success": success, "message": message, "payload": payload};
}

export default formatMessage;