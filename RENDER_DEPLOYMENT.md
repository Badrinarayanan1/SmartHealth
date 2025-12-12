# Deployment Guide: Render.com

This guide outlines how to deploy the SmartCare application (Frontend + Backend) to Render.

## ⚠️ Prerequisite: API URL Configuration
**Critical Step**: Before deploying, ensure your Frontend knows where your Backend is hosted.
Currently, the frontend might be using `http://localhost:5000`. You should update your frontend API calls to use an environment variable (e.g., `import.meta.env.VITE_API_URL`).

## Part 1: Backend Deployment (Web Service)

1.  **Create New Web Service**:
    *   Connect your GitHub repository.
2.  **Configuration**:
    *   **Name**: `smartcare-backend` (or similar)
    *   **Root Directory**: `backend`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
3.  **Environment Variables**:
    *   Add the following variables in the "Environment" tab:
        *   `MONGO_URI`: Your MongoDB Atlas connection string.
        *   `PORT`: `10000` (Render acts on this port by default, or it will assign one).
4.  **Deploy**: Click "Create Web Service".
5.  **Copy URL**: Once live, copy your backend URL (e.g., `https://smartcare-backend.onrender.com`).

---

## Part 2: Frontend Deployment (Static Site)

1.  **Create New Static Site**:
    *   Connect the same GitHub repository.
2.  **Configuration**:
    *   **Name**: `smartcare-frontend`
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm install; npm run build` (This typically runs `vite build`)
    *   **Publish Directory**: `dist`
3.  **Environment Variables**:
    *   If you refactored your code to use env vars, add:
        *   `VITE_API_URL`: `https://smartcare-backend.onrender.com` (Your backend URL)
4.  **Rewrite Rules (Crucial for React Router)**:
    *   Go to **Redirects/Rewrites** tab.
    *   Add a new rule:
        *   **Source**: `/*`
        *   **Destination**: `/index.html`
        *   **Action**: `Rewrite`
    *   *Reason*: This ensures that if a user refreshes a page like `/doctor/dashboard`, the server serves the React app instead of a 404.
5.  **Deploy**: Click "Create Static Site".

## Troubleshooting

*   **CORS Errors**: If the frontend cannot talk to the backend, check `server.js` in the backend. Ensure `cors` is enabled and allows your Render frontend domain.
    ```javascript
    app.use(cors({
        origin: ["https://your-frontend.onrender.com", "http://localhost:5173"]
    }));
    ```
*   **White Screen on Refresh**: You likely missed the **Rewrite Rule** in Part 2.
