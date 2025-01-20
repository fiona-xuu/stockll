import { assert, ActionOptions } from "gadget-server";
import Sentiment from "sentiment";

interface FinnhubNewsResponse {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  related: string;
  source: string;
  summary: string;
  url: string;
}

interface NewsAnalysis {
  article: {
    title: string;
    summary: string;
    url: string;
    datetime: string;
  };
  sentiment: {
    score: number;
    interpretation: string;
  };
}

export const run: ActionRun = async ({ params, logger }) => {
  try {
    const stockSymbol = assert(params.symbol, "Stock symbol is required");

    const response = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${stockSymbol}&from=2024-01-01&to=2024-12-31&token=${process.env.FINNHUB_API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }

    const news = (await response.json()) as FinnhubNewsResponse[];
    if (!news.length) {
      throw new Error("No news articles found for this stock");
    }

    const latestArticle = news[0];
    console.log(latestArticle);
    const sentiment = new Sentiment();
    const analysis = sentiment.analyze(latestArticle.headline + " " + latestArticle.summary);

    const result: NewsAnalysis = {
      article: {
        title: latestArticle.headline,
        summary: latestArticle.summary,
        url: latestArticle.url,
        datetime: new Date(latestArticle.datetime * 1000).toISOString(),
      },
      sentiment: {
        score: analysis.score,
        interpretation: analysis.score > 0 ? "Positive" : analysis.score < 0 ? "Negative" : "Neutral"
      }
    };
    console.log(result);
    return result;
  } catch (error) {
    logger.error("Error fetching stock news:", error);
    throw error;
  }
};

export const params = {
  symbol: { type: "string" }
};

export const options: ActionOptions = {
  returnType: true
};
