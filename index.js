// Root endpoint - redirect to API info
module.exports = async (req, res) => {
  res.redirect('/api/index');
};