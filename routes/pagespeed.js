const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // const url = req.query.url;
  let url = decodeURIComponent(req.query.url);
  // your code here
  // `https://pagespeed.web.dev/api/runPagespeed?url=${url}`
  request.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body)
      // send the data to the frontend
      res.json(data);
    }
  });
});

module.exports = router;
