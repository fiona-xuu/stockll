import { useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useGlobalAction, useAction, useUser, useFindMany } from "@gadgetinc/react";
import { ExternalLink } from "lucide-react";
import TradingViewWidget from "@/components/stock-screener";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "../api";
import { useToast } from "@/components/ui/use-toast";

interface SubscribeButtonProps {
  stockData: {
    symbol: string;
    currentPrice: number;
    percentChange: number;
  };
}

const SubscribeButton = ({ stockData }: SubscribeButtonProps) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const user = useUser();
  const { toast } = useToast();
  const [{ error }, subscribe] = useAction(api.subscribedStocks.create);
  const [{ data: subscriptions }] = useFindMany(api.subscribedStocks, {
    filter: {
      AND: [
        { pinnedById: { equals: user.id } },
        { StockID: { equals: stockData.symbol } }
      ]
    }
  });

  const isSubscribed = () => {
    return subscriptions && subscriptions.length > 0;
  };

  const handleSubscribe = async () => {
    if (isSubscribed()) {
      toast({ title: "Already subscribed", description: `You are already following ${stockData.symbol}`, variant: "destructive" });
      return;
    }
    setIsSubscribing(true);
    try {
      await subscribe({
        StockID: stockData.symbol,
        StockPrice: stockData.currentPrice,
        Change: stockData.percentChange,
        StockName: stockData.symbol,
        pinnedBy: { _link: user.id },
      });
      toast({
        title: "Subscribed!",
        description: `You are now tracking ${stockData.symbol} in your portfolio`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: error?.message || "Failed to subscribe to stock",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isSubscribing || isSubscribed()}
      variant={isSubscribed() ? "secondary" : "default"}
    >
      {isSubscribing ? "Subscribing..." : isSubscribed() ? "Subscribed" : "Subscribe"}
    </Button>
  );
};

export default function StockScreen() {
  const [searchParams] = useSearchParams();
  const symbol = decodeURIComponent(searchParams.get("symbol") ?? "AAPL");

  const [{ data: stockData, error: stockError, fetching: stockFetching }, getStockData] = useGlobalAction(api.getStockData);
  const [{ data: newsData, error: newsError, fetching: newsFetching }, getStockNews] = useGlobalAction(api.getStockNews);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getStockData({ symbol: symbol }),
        getStockNews({ symbol: symbol })
      ]);
    };
    void fetchData();
  }, [symbol, getStockData, getStockNews]);

  if (stockFetching && !stockData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg">Loading stock data...</p>
      </div>
    );
  }

  if (stockError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-red-500">Error loading stock data: {stockError.message}</p>
      </div>
    );
  }

  const stockDetails = stockData;

  return (
    <div className="flex flex-col gap-y-6">
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Stock Details - {symbol}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold">${stockDetails?.currentPrice?.toFixed(2) ?? "N/A"}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Change</p>
              <p className={`text-2xl font-bold ${(stockDetails?.percentChange ?? 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stockDetails?.percentChange?.toFixed(2) ?? "N/A"}% ({stockDetails?.change?.toFixed(2) ?? ""})
              </p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">High Price</p>
              <p className="text-2xl font-bold">${stockDetails?.highPrice?.toFixed(2) ?? "N/A"}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Low Price</p>
              <p className="text-2xl font-bold">${stockDetails?.lowPrice?.toFixed(2) ?? "N/A"}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Open</p>
              <p className="text-2xl font-bold">${stockDetails?.openPrice?.toFixed(2) ?? "N/A"}</p>
            </div>
            <SubscribeButton stockData={{ symbol, currentPrice: stockDetails?.currentPrice, percentChange: stockDetails?.percentChange }} />
          </CardContent>
        </Card>
      </section>

      {/* TradingView Widget Section */}
      <section className={`w-full h-[650px] ${stockFetching ? "opacity-50" : ""}`}>
        <TradingViewWidget symbol={symbol} />
      </section>

      {/* News Section */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Latest News</CardTitle>
          </CardHeader>
          <CardContent>
            {newsFetching && !newsData ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-lg">Loading news...</p>
              </div>
            ) : newsError ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-lg text-red-500">Error loading news: {newsError.message}</p>
              </div>
            ) : newsData?.article ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{newsData.article.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{new Date(newsData.article.datetime).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>
                    Sentiment:
                    <span
                      className={`ml-1 font-medium ${newsData.sentiment.score > 0 ? "text-green-500" :
                        newsData.sentiment.score < 0 ? "text-red-500" : "text-yellow-500"
                        }`}
                    >
                      {newsData.sentiment.interpretation}
                    </span>
                  </span>
                </div>
                <p className="text-sm">{newsData.article.summary}</p>
                {/* Sentiment impact message */}
                {newsData.sentiment.score > 0 && (
                  <p className="text-sm text-green-500">
                    This positive sentiment may be a cause of an increase in stock price.
                  </p>
                )}
                {newsData.sentiment.score < 0 && (
                  <p className="text-sm text-red-500">
                    This negative sentiment may be a cause of a decrease in stock price.
                  </p>
                )}
                <Button variant="outline" asChild>
                  <a href={newsData.article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Read Full Article <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>


    </div>
  );
}
