// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string; // Define the prop for the symbol
}

function TradingViewWidget({ symbol = "TSLA" }: TradingViewWidgetProps): JSX.Element {
  const container = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Check if the script is already in the document
    if (document.getElementById('tradingview-widget-script')) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.id = 'tradingview-widget-script'; // Set an id to prevent re-adding the script
    script.innerHTML = `
    {
      "autosize": true,
      "symbol": "${symbol}",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    }`;

    if (container.current) {
      container.current.appendChild(script);
    }

    // Cleanup function to remove the script when the component unmounts
    return () => {
      if (container.current) {
        container.current.innerHTML = ''; // Clear the container content
      }
    };
  }, [symbol]); // Re-run if the symbol changes

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
    </div>
  );
}

export default memo(TradingViewWidget);
