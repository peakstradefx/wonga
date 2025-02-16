"use client"
import React, { useEffect, useRef, memo } from 'react';

const TradingViewWidget: React.FC = () => {
  // Ref for the container element, typed as HTMLDivElement
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container.current) {
      // Create the script element dynamically
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;

      // Define the widget configuration in JSON format
      script.innerHTML = `
      {
        "autosize": true,
        "symbol": "FX:EURUSD",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;

      // Append the script to the container
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div
      className="tradingview-widget-container rounded-md"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
