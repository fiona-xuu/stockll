import { ActionOptions } from "gadget-server";

// Define the type for the params argument
interface StockParams {
  symbol: string;
}

// Define the type for the logger argument
interface Logger {
  error: (message: string, context?: any) => void;
  // Add any other methods you use from the logger
}

// Define the response structure
interface QuoteResponse {
  currentPrice: number;
  change: number;
  percentChange: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClose: number;
  volume: number;
}

export const params = {
  symbol: { type: "string" }
};
// Adjusting the Action function
export const run = async ({
  params,
  logger
}: {
  params: StockParams; // Specify that params is of type StockParams
  logger: Logger;      // Specify that logger is of type Logger
}): Promise<QuoteResponse> => {
  const { symbol } = params;

  if (!symbol) {
    throw new Error("Stock symbol is required");
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    logger.error("Missing Finnhub API key");
    throw new Error("Missing API configuration");
  }

  try {
    // Use the fetch API to get stock quote data from Finnhub
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      logger.error("Finnhub API error", { status: response.status });
      throw new Error(`Failed to fetch stock data: ${response.statusText}`);
    }

    const data = await response.json();

    const quote: QuoteResponse = {
      currentPrice: data.c,
      change: data.d,
      percentChange: data.dp,
      highPrice: data.h,
      lowPrice: data.l,
      openPrice: data.o,
      previousClose: data.pc,
      volume: data.v
    };
    console.log(quote)
    return quote;
  } catch (error) {
    logger.error("Error fetching stock quote", { error });
    throw new Error("Failed to fetch stock quote");
  }
};

// Defining ActionOptions correctly
export const options: ActionOptions = {
  returnType: true // You might need to specify additional properties here depending on the framework you're using
};
