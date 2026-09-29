export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. Create a home interface if no target URL is provided
    if (url.pathname === "/" || !url.searchParams.has("url")) {
      return new Response(getHomeHTML(), {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    // 2. Extract the target URL from the query string
    let targetUrlString = url.searchParams.get("url");
    if (!targetUrlString.startsWith("http://") && !targetUrlString.startsWith("https://")) {
      targetUrlString = "https://" + targetUrlString;
    }

    try {
      const targetUrl = new URL(targetUrlString);

      // 3. Fetch the content from the target site acting as an intermediary
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "follow"
      });

      const response = await fetch(modifiedRequest);
      
      // 4. Return the website data safely back to the user
      return response;

    } catch (err) {
      return new Response(`Proxy Error: Unable to fetch target URL. Details: ${err.message}`, { status: 500 });
    }
  }
};

// Simple visual interface served by the proxy server
function getHomeHTML() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>My Cloud Proxy Engine</title>
      <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #111; color: white; margin: 0; }
        .box { background: #222; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); text-align: center; }
        input { width: 300px; padding: 10px; border: none; border-radius: 4px; margin-right: 10px; font-size: 16px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
        button:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>Cloud Proxy Portal</h2>
        <p>Enter any web address to browse anonymously</p>
        <form action="/" method="get">
          <input type="text" name="url" placeholder="example.com" required>
          <button type="submit">Browse</button>
        </form>
      </div>
    </body>
    </html>
  `;
}
