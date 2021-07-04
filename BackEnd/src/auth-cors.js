
// This middleware intercepts the request from the HTTP pipeline to add the headers that can enable a client application to send a request from another domain.

module.exports = (req, res, next) => {

    if (req.headers.origin) {
      // remote domain added or only the environment listed on a configuration
        res.setHeader(
            "Access-Control-Allow-Origin",
            process.env.domain || req.headers.origin
        );
    }
  
    // Request methods allowed
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST" //, OPTIONS, PUT, PATCH, DELETE"
    );
  
    // Request headers allowed
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,Authorization,X-Requested-With,content-type,Accept"
    );
  
    // Set to true if website needs to include cookies in the requests sent to the API
    res.setHeader("Access-Control-Allow-Credentials", true);
  
    if ("OPTIONS" === req.method) {
        return res.sendStatus(200);
    }
  
    return next(); // Pass to next layer of middleware
};