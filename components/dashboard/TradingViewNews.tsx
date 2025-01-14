"use client"
import React, { useEffect, useRef } from 'react';

interface TradingViewConfig {
    feedMode: string;
    isTransparent: boolean;
    displayMode: string;
    width: string;
    height: string;
    colorTheme: string;
    locale: string;
}

const TradingViewTimeline: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const createWidget = () => {
            const script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js');

            const config: TradingViewConfig = {
                feedMode: "all_symbols",
                isTransparent: false,
                displayMode: "regular",
                width: "100%",
                height: "400",
                colorTheme: "dark",
                locale: "en"
            };

            script.textContent = JSON.stringify(config);

            const widgetContainer = container.querySelector<HTMLDivElement>('.tradingview-widget-container__widget');
            if (widgetContainer) {
                widgetContainer.innerHTML = '';
                widgetContainer.appendChild(script);
            }
        };

        createWidget();

        return () => {
            if (container) {
                const widgetContainer = container.querySelector<HTMLDivElement>('.tradingview-widget-container__widget');
                if (widgetContainer) {
                    widgetContainer.innerHTML = '';
                }
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full">
            <div className="tradingview-widget-container" style={{ height: '500px' }}>
                <div className="tradingview-widget-container__widget"></div>
                <div className="tradingview-widget-copyright">
                    <a
                        href="https://www.tradingview.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        Track all markets on TradingView
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TradingViewTimeline;