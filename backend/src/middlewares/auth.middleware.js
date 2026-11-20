import jwt from "jsonwebtoken";
import ApiError from "../utils/api-error.js";

const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;

  // * Stops unauthentic access i.e., no JWT
  if (!authorization?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = authorization.split(" ")[1];

  try {
    // * Authenticate the user having JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.sub) {
      throw new Error("Invalid token payload");
    }

    req.user = {
      id: payload.sub,
    };

    next();
  } catch {
    // * Unauthenticated user
    next(new ApiError(401, "Invalid or expired access token"));
  }
};

export default authenticate;
