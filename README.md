# Sitemap Generator

Generate sitemaps using Chrome browser. Especially intended for generating sitemaps for single-page apps made with react, angular, etc.

## Installation

The latest version is available for installation at Chrome Web Store.

**[Install here](https://chrome.google.com/webstore/detail/hcnjemngcihnhncobgdgkkfkhmleapah "Sitemap Generator")**
    
    
## Idea 💡

I make a lot of web apps using react and angular. I know there are dev tools that allow generating sitemaps but these require more or less custom setup. I also tried online services that offer to create sitemaps, but found that these were not actually rendering the client side code. My last attempt was trying a service that said it would run in the browser but required some custom code be placed on the website to circumvent cors. At this point I gave up and made my own solution. I decided to make a chrome extension because it addresses many of the issues that occur with the above solutions: 

- Allows rendering javascript
- Avoids most server-side bottlenecks
- Usable with any web tech stack
- Can override CORS policies
- No application specific setup
- Accommodates website changes
- Suitable for non-technical users

This extension works by taking some start URL, crawling that page for more links, and then recursively crawling those pages for more links. Once all found links have been checked, the extension generates a sitemap file. Of course this approach assumes website is properly using anchor tags to connect its contents. The extension also checks HTTP headers and excludes pages that return failing response codes.

This implementation is not practical if website contains tens of thousands of pages. It can however, crawl a few thousand entries in a reasonable amount of time. Also note while the sitemap is being generated, you may continue regular browsing at the same time. The generator will run in its own window.
