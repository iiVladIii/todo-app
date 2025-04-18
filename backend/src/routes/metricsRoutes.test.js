const request = require('supertest');
const express = require('express');
const app = express();
const router = require('./metricsRoutes');
const { register } = require('../metrics/metrics');

app.use(router);

jest.mock('../metrics/metrics');

describe('Metrics Router', () => {
    describe('GET /metrics', () => {
        it('should return metrics', async () => {
            const mockMetricsData = 'mocked_metrics_data';
            register.contentType = 'text/plain';
            register.metrics.mockResolvedValue(mockMetricsData);

            const response = await request(app).get('/metrics');

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('text/plain');
            expect(response.text).toBe(mockMetricsData);
        });
    });
});
