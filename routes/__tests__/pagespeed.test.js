const request = require('supertest');
const express = require('express');
const router = require('../pagespeed'); // import your router file
const app = express();
app.use(router);

const mockData =
  {
    "lighthouseResult": {
      "categories": {
        "performance": {
          "title": "Performance",
          "description": "Speed is a feature",
          "score": 0.95,
          "subcategories": {
            "first-contentful-paint": {
              "score": 0.97
            }
          }
        }
      },
      audits: {
        'first-contentful-paint': {
          numericValue: 1000
        },
        'interactive': {
          numericValue: 2000
        }
      }

    }
  };

jest.mock('request', () => jest.fn((options, cb) => {
  cb(null, {}, JSON.stringify(mockData));
}));


afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /', () => {
  it('should return json data for all competitors', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body.length).toBe(4);  // 4 competitors
    expect(response.body[0]).toHaveProperty('site', 'https://www.amazon.com');
    expect(response.body[0]).toHaveProperty('speedScore');
    expect(response.body[0]).toHaveProperty('firstContentfulPaint');
    expect(response.body[0]).toHaveProperty('timeToInteractive');
  });

  it('should handle errors and return 500 status', async () => {
    jest.resetModules();
    // Import the actual implementation of the module
    jest.resetModules();
    jest.mock('request', () => (options, cb) => {
      cb(new Error('Some error'));
    });

    const router = require('../pagespeed'); // Import the module again
    const app = express();
    app.use(router);

    const spy = jest.spyOn(console, 'log').mockImplementation();
    // You can mock the request to  return an error
    const response = await request(app).get('/');
    expect(response.status).toBe(500);
    expect(response.type).toBe('application/json');
    expect(response.body).toEqual({ message: 'Error fetching data' });
    expect(spy).toHaveBeenCalledWith(new Error('Some error'));
    spy.mockRestore();
  });
});
