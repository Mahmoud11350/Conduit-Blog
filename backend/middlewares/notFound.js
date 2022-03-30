const notFound = (req, res) =>
  res.status(404).json({ msg: "Route Doesn't Found" });

module.exports = notFound;
