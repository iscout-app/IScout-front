/**
 * IScout Frontend Server
 *
 * Bun-powered development server with:
 * - Hot Module Replacement (HMR)
 * - TypeScript transpilation
 * - CSS bundling
 * - API proxy to backend
 */

const PORT = 5173;
const API_URL = "http://localhost:3000";

console.log(`\n🚀 IScout Frontend Server v2.0`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`📁 Mode:     ${process.env.NODE_ENV || 'development'}`);
console.log(`🌐 Frontend: http://localhost:${PORT}`);
console.log(`🔌 API:      ${API_URL}`);
console.log(`⚡ HMR:      ENABLED`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

Bun.serve({
  port: PORT,

  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // API Proxy - forwards all /v1/* requests to backend
    if (pathname.startsWith('/v1/')) {
      const apiURL = `${API_URL}${pathname}${url.search}`;

      try {
        const response = await fetch(apiURL, {
          method: req.method,
          headers: req.headers,
          body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
        });

        return response;
      } catch (error) {
        console.error(`❌ API Proxy Error:`, error);
        return new Response(JSON.stringify({
          error: 'Backend unavailable',
          message: 'Make sure API server is running on port 3000'
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Serve static files from src/
    let filePath = pathname;

    // Root serves index.html from src/
    if (pathname === '/' || pathname === '/index.html') {
      filePath = '/index.html';
    }

    // Try to serve from src/ directory
    const file = Bun.file(`./src${filePath}`);
    const exists = await file.exists();

    if (exists) {
      return new Response(file);
    }

    // Fallback to root for backward compatibility
    const rootFile = Bun.file(`.${filePath}`);
    const rootExists = await rootFile.exists();

    if (rootExists) {
      return new Response(rootFile);
    }

    // 404 for missing files
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>404 - Not Found</title>
          <style>
            body {
              font-family: system-ui;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #0f172a;
              color: #f1f5f9;
            }
            .container { text-align: center; }
            h1 { font-size: 4rem; margin: 0; }
            p { opacity: 0.7; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <p>Page not found: ${pathname}</p>
            <a href="/" style="color: #3b82f6;">← Back to home</a>
          </div>
        </body>
      </html>
    `, {
      status: 404,
      headers: { 'Content-Type': 'text/html' }
    });
  },

  development: {
    hmr: true,        // Hot Module Replacement
    console: true,    // Show console logs from browser
  },

  error(error) {
    console.error('❌ Server Error:', error);
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>500 - Server Error</title>
          <style>
            body {
              font-family: system-ui;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #0f172a;
              color: #f1f5f9;
            }
            .container { text-align: center; max-width: 600px; padding: 2rem; }
            h1 { color: #ef4444; }
            pre {
              background: #1e293b;
              padding: 1rem;
              border-radius: 8px;
              text-align: left;
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>500 - Server Error</h1>
            <pre>${error.message}\n\n${error.stack}</pre>
            <p><a href="/" style="color: #3b82f6;">← Back to home</a></p>
          </div>
        </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
});
