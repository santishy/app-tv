const handleFilters = (allowedFilters, customFilters) => (req, res, next) => {
  const { filter = {} } = req.query;

  req.filters = Object.entries(filter).reduce((acc, [key, value]) => {
    if (!allowedFilters.includes(key)) {
      return res.status(400).json({
        errors: [
          {
            message: `Filter ${key} is not allowed.`,
          },
        ],
      });
    }
    try {
      if (customFilters[key]) {
        acc = { ...acc, ...customFilters[key](value) };
      } else {
        acc[key] = new RegExp(value, "i");
      }
      return acc;
    } catch (error) {
      res.status(400).json({
        errors: [
          {
            message: error.message,
          },
        ],
      });
    }
  }, {});
  next();
};

module.exports = {
  handleFilters,
};
