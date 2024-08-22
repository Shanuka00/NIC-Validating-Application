import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

app.use(cors());

// Proxy requests to user-service
app.use('/user', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/user': '',
    },
  }));

// Proxy for /api/nic-validation endpoints
app.use('/api/nic-validation', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
}));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
