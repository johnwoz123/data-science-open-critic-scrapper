// npm packages
const fetch = require("node-fetch");
const Microwork = require("microwork");
const extractor = require("unfluff");
const cheerio = require("cheerio");

// internal packages
const config = require("../config");
const logger = require("./logger");

// configuration variables
const searchTeamUrlBase = "http://opencritic.com/api/site/search?criteria=";
const gameInfoBase = "http://opencritic.com/api/game?id=";

// adding a sleep function so the server is not brute forced and I am logged out
const sleep = time => new Promise(resolve => setTime(resolve, time));

// Code here will be linted with JSHint.

const getGame = async name => {
  const requestUrl = `${searchUrlBase}${encodeURIComponent(
    name.toLowerCase()
  )}`;
  const results = await fetch(requestUrl).then(r => r.json());
  const topHit = results[0];
  return topHit;
};

const getExGameData = async gameData => {
  const url = `${gameInfoBase}${gameData.id}`;
  const exGameData = await fetch(url).then(r => r.json());
  return Object.assign({}, gameData, exGameData);
};

const enrichReviewWithText = async review => {
  const pageHTML = await fetch(review.externalUrl)
    .then(r => r.json())
    .catch(e => {
      logger.error("Error fetching review:", review.externalUrl, e);
      return undefined;
    });
  if (!pageHTML) {
    return review;
  }
  const result = await extractor(pageHTML);
  if (!result.text || !result.text.length) {
    const $ = cheerio.load(pageHTML);
    const text = $('body').text();
    return Object.assign({}, review, {text, html: pageHTML});
  }
  return Object.assign({}, review, {text: result.text, html: pageHTML, extracted: result});
};


const scrapeReviews = async (data, store) => {
  const {game} = data;
  logger.debug('Searching for:', game);
}