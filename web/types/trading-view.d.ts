/**
 * Type definitions for TradingView Lightweight Charts Widget
 */

declare namespace TradingView {
  /**
   * Configuration options for TradingView Widget
   */
  interface WidgetConfig {
    /** The DOM element id where the widget will be rendered */
    container_id?: string;
    /** The DOM element where the widget will be rendered */
    container?: HTMLElement;
    /** Trading symbol to display (e.g. "NASDAQ:AAPL") */
    symbol?: string;
    /** Chart interval ("1", "5", "15", "30", "60", "D", "W") */
    interval?: string;
    /** Widget theme ("light" or "dark") */
    theme?: string;
    /** Widget locale code */
    locale?: string;
    /** Widget timezone */
    timezone?: string;
    /** Widget width in pixels or percentage */
    width?: number | string;
    /** Widget height in pixels or percentage */
    height?: number | string;
    /** Save chart layouts and settings to localStorage */
    save_image?: boolean;
    /** Enable drawing tools */
    enable_publishing?: boolean;
    /** Hide top toolbar */
    hide_top_toolbar?: boolean;
    /** Hide legend */
    hide_legend?: boolean;
    /** Widget visual style ("0" through "4") */
    style?: string;
    /** List of available tools in toolbar */
    toolbar_bg?: string;
    /** Show volume */
    show_popup_button?: boolean;
    /** Widget popup width */
    popup_width?: string;
    /** Widget popup height */
    popup_height?: string;
    /** Disable automatic symbol info updates */
    autosize?: boolean;
    /** Studies to display on chart */
    studies?: string[];
    /** Custom CSS object */
    overrides?: Record<string, any>;
  }

  /**
   * TradingView Widget class
   */
  class widget {
    constructor(config: WidgetConfig);
  }
}

/**
 * Extend the Window interface to include TradingView
 */
interface Window {
  TradingView: {
    widget: typeof TradingView.widget;
  };
}

declare global {
  export { TradingView };
}