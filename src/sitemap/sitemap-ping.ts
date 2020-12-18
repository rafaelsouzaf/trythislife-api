import { Response } from '../util/response';
import fetch from 'node-fetch';

exports.handler = (event, context, callback) => {
    // PING GOOGLE SEARCH
    let siteMapUrl = 'https://www.google.com/ping?sitemap=https://api.newleaf.app/v1/sitemap';
    fetch(siteMapUrl).then((res) => {
        console.log('Google Pong');
    });

    // PING BING
    siteMapUrl = 'http://www.bing.com/ping?sitemap=https://api.newleaf.app/v1/sitemap';
    fetch(siteMapUrl).then((res) => {
        console.log('Bing Pong');
    });

    Response.sendText(callback, 200, 'OK');
};
