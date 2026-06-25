const validator = require("validator");

const validateSignUpData = (data) => {
  const { firstName, emailId, password } = data;

  const mandatoryFields = ["firstName", "emailId", "password"];

  if (!mandatoryFields.every((field) => req.body[field])) {
    throw new Error("Missing required fields");
  }

  if (!validator.isEmail(req.body.emailId)) {
    throw new Error("Invalid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

module.exports = validateSignUpData;
