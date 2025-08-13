const { Readability, isProbablyReaderable } = require ('@mozilla/readability')
const createDOMPurify = require('dompurify');
const jsdom = require("jsdom");
const RSS = require('rss');
const fs = require("fs");

const { JSDOM } = jsdom;

const getFeed = () => {
    return new RSS({
        title: 'My feed',
        link: 'https://example.com',
        description: 'A feed for my saved articles',
    })
}

const getFeedItemFromUrl = async (url) => {
    const dom = await JSDOM.fromURL(url, {})
    const DOMPurify = createDOMPurify(dom.window);
    const doc = dom.window.document;

    // TODO: Use isReadable here?
    const article = new Readability(doc).parse();
    const cleanArticleContent = DOMPurify.sanitize(article.content, { USE_PROFILES: { html: true } });

    return {
        title: article.title,
        description: cleanArticleContent,
        author: article.byline,
        url,
        date: article.publishedTime,
    }
}

const url1 = 'https://hackaday.com/2025/07/29/power-line-patrols-the-grids-eye-in-the-sky/'
const url2 = 'https://www.wired.com/story/war-of-the-worlds-isnt-just-bad-its-also-shameless-tech-propaganda/'
const url3 = 'https://techcrunch.com/2025/08/13/pebbles-smartwatch-is-back-pebble-time-2-specs-revealed/'

const main = async () => {
    const myFeed = getFeed()
    const feedItem1 = await getFeedItemFromUrl(url1)
    const feedItem2 = await getFeedItemFromUrl(url2)
    const feedItem3 = await getFeedItemFromUrl(url3)

    // TODO: Decide how to order feed items
    myFeed.item(feedItem1)
    myFeed.item(feedItem2)
    myFeed.item(feedItem3)

    const xml = myFeed.xml();

    fs.writeFile("./feed.xml", xml, (err) => {
        if (err) {
            console.error(err);
        } else {
            // File written successfully
        }
    });
}

main()
