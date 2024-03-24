export default {
    async fetch(request, env) {
        // Fetch the asset
        const response = await env.ASSETS.fetch(request);
        
        const url = new URL(request.url);
        if (url.pathname == "/sw.js") {
            // Get the current timestamp in ms
            let timestampMs = Date.now();
            
            // Clone the response so we can modify headers
            const responseClone = new Response(response.body, response);

            // modify the script content to replace our placeholder with the current server timestamp
            var scriptContent = await response.text()
            scriptContent = scriptContent.replace( /WILL_BE_REPLACED_BY_SERVER_TIMESTAMP/g, timestampMs)

            // Sets a header to cache our service worker for 7 days (3600*24*7)
            responseClone.headers.set("Cache-Control", "public, max-age=604800, immutable");
            responseClone.headers.set("Content-Type", "text/javascript");
            return new Response(scriptContent, {headers: responseClone.headers})
        }

        // Return our response!
        return response;
    },
}
