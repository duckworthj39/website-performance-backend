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

const fetchPageSpeedData = (url) => {
  const pagespeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`;
  return new Promise((resolve, reject) => {
    request(pagespeedUrl, (error, response, body) => {
      if (error) reject(error);
      resolve(formatData(JSON.parse(body), url));
    });
  });
}

const formatData = (data, url) => {
  const speedScore = data.lighthouseResult.categories.performance.score;

  return {
    site: url,
    speedScore: speedScore
  };
}

module.exports = router;
