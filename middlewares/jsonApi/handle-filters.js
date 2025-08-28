const handleFilters = (allowedFilters, customFilters) => (req, res, next) => {
  const { filter = {} } = req.query;

  req.filters = {};
  for (const [key, value] of Object.entries(filter)) {
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
        // req.filters = { ...req.filters, ...customFilters[key](value) };
        Object.assign(req.filters, customFilters[key](value));
      } else {
        req.filters[key] = new RegExp(value, 'i');
      }
    } catch (error) {
      return res.status(400).json({
        errors: [
          {
            message: error.message,
          },
        ],
      });
    }
  }
  next();
};

module.exports = {
  handleFilters,
};
