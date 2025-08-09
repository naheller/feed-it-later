const { Readability } = require ('@mozilla/readability')
const createDOMPurify = require('dompurify');
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const url = 'https://hackaday.com/2025/08/04/happy-birthday-6502/'

// const article = new Readability({}).parse();

const getArticle = async () => {
    const dom = await JSDOM.fromURL(url, {})
    const DOMPurify = createDOMPurify(dom.window);
    const document = dom.window.document
    const article = new Readability(document).parse();
    console.log('article', article)
    const cleanArticle = DOMPurify.sanitize(article, { USE_PROFILES: { html: true } });
    // console.log('cleanArticle', cleanArticle)
    return cleanArticle
}

const articleHtml = getArticle()
