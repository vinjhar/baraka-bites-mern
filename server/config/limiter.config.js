import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,       // 1 minute
  max: 10,                       // Limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many requests, please try again in a minute.',
  },
  handler: (req, res, next, options) => {
  console.log(`Too many requests from IP: ${req.ip}`);
  res.status(options.statusCode).json(options.message);
},
  statusCode: 429,              // Default too many requests status
  standardHeaders: true,        // Return RateLimit-* headers
  legacyHeaders: false,         // Disable X-RateLimit-* headers
  skipSuccessfulRequests: false // Count successful requests too (default behavior)
});

export default limiter;
