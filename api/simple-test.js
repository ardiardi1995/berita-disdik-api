// Very simple test without any dependencies
export default function handler(req, res) {
  res.status(200).json({
    message: "Simple test endpoint working!",
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
}