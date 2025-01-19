import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StockSearch } from "@/components/stock-search";

export default function SignedInPage() {
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string; } | null>(null);

  const handleStockSelect = (stock: { symbol: string; name: string; }) => {
    setSelectedStock(stock);
  };

  useEffect(() => {
    // Dynamically load the TradingView script for the timeline widget (Live News)
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "all_symbols",
      isTransparent: true,
      displayMode: "adaptive",
      width: "100%",
      height: "100%",
      colorTheme: "dark",
      locale: "en"
    });

    const container = document.getElementById("tradingview-widget-live-news");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // Cleanup the script when the component unmounts
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    // Dynamically load the TradingView script for the hotlists widget (Market Overview)
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      exchange: "US",
      showChart: true,
      locale: "en",
      width: "100%",
      height: "100%",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: false,
      showFloatingTooltip: false,
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(42, 46, 57, 0)",
      scaleFontColor: "rgba(209, 212, 220, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)"
    });

    const container = document.getElementById("tradingview-widget-market-overview");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // Cleanup the script when the component unmounts
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 w-full text-center py-8">
        <h1 className="text-6xl font-bold tracking-tight text-center">Stock Search</h1>
        <p className="text-muted-foreground text-center text-lg">
          Search for stocks and view market updates.
        </p>
      </div>

      {/* Quick Search Section */}
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-accent/5 rounded-lg pb-8 shadow-sm">
          <StockSearch onSelect={handleStockSelect} className="stock-search w-full text-xl" />
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid gap-6 md:grid-cols-2 mt-12">
        {/* Live News */}
        <Card className="h-[750px] overflow-hidden">
          <CardHeader className="flex items-center gap-2 text-2xl font-semibold">
            <span>Live News</span>
          </CardHeader>
          <CardContent className="p-6 h-full">
            {/* Embed the TradingView Widget for Live News */}
            <div className="tradingview-widget-container h-full">
              <div
                className="tradingview-widget-container__widget"
                id="tradingview-widget-live-news"
                style={{ height: "calc(100% - 4rem)" }} // Adjust for larger header size
              ></div>
              <div className="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                  <span className="blue-text">Track all markets on TradingView</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Overview */}
        <Card className="h-[750px] overflow-hidden">
          <CardHeader className="flex items-center gap-2 text-2xl font-semibold">
            <span>Market Overview</span>
          </CardHeader>
          <CardContent className="p-6 h-full">
            <div className="tradingview-widget-container h-full">
              <div
                className="tradingview-widget-container__widget"
                id="tradingview-widget-market-overview"
                style={{ height: "calc(100% - 4rem)" }} // Adjust for larger header size
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>


  );
}
