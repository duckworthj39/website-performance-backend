const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', (req, res) => {
  const competitors = ['https://www.amazon.com', 'https://www.walmart.com', 'https://www.bestbuy.com', 'https://www.target.com'];
  const promises = competitors.map(url => fetchPageSpeedData(url));

  Promise.all(promises)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error fetching data' });
    });
});

// This function fetches the page performance from the lighthouse API
const fetchPageSpeedData = (url) => {
  const pagespeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`;
  return new Promise((resolve, reject) => {
    request(pagespeedUrl, (error, response, body) => {
      if (error) reject(error);
      resolve(formatData(JSON.parse(body), url));
    });
  });
}

// This function formats the data to be returned
const formatData = (data, url) => {
  const speedScore = data.lighthouseResult.categories.performance.score;
  // Divide the numeric scores by 1000 to get seconds rather than milliseconds
  const firstContentfulPaint = data.lighthouseResult.audits['first-contentful-paint'].numericValue / 1000;
  const timeToInteractive = data.lighthouseResult.audits['interactive'].numericValue / 1000;

  return {
    site: url,
    speedScore: speedScore,
    firstContentfulPaint: firstContentfulPaint,
    timeToInteractive: timeToInteractive,
  };
}

module.exports = router;
