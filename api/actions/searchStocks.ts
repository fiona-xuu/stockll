import { ActionOptions } from "gadget-server";


interface StockResult {
  symbol: string;
  description: string;
  type?: string;
}

interface FinnhubSearchResponse {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }>;
}

export const params = {
  searchTerm: { type: "string" }
};


export const run: ActionRun = async ({ params, logger, config }): Promise<StockResult[]> => {
  if (!params.searchTerm) {
    return [];
  }


  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    logger.error("Missing Finnhub API key");
    throw new Error("Missing API configuration");
  }

  try {
    const url = `https://finnhub.io/api/v1/search?q=${params.searchTerm}&exchange=US&token=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      logger.error("Finnhub API error", { status: response.status });
      throw new Error(`Failed to fetch stock data: ${response.statusText}`);
    }

    const data = (await response.json()) as FinnhubSearchResponse;
    return data.result.map(item => ({
      symbol: item.symbol,
      description: item.description,
      type: item.type
    }));
  } catch (error) {
    logger.error("Error searching stocks", { error });
    throw new Error("Failed to search stocks");
  }
};

export const options: ActionOptions = {
  returnType: true,
  triggers: {
    api: true
  },
  timeoutMS: 30000 // 30 second timeout for API calls
};
