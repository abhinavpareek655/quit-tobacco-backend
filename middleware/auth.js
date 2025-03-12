exports.authenticateUser = (req, res, next) => {
  console.warn('⚠️ Authentication is temporarily disabled.');
  req.user = null; // Allow all requests without authentication
  next();
};
