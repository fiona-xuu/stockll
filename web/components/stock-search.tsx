import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { useGlobalAction } from "@gadgetinc/react";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "../lib/utils";
import { api } from "../api";

interface StockSearchProps {
  onSelect: (stock: { symbol: string; name: string; }) => void;
  className?: string;
}

interface StockResult {
  symbol: string;
  description: string;
  type?: string;
}

export function StockSearch({ onSelect, className }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<StockResult[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [{ data, error, fetching }, searchStocks] = useGlobalAction(api.searchStocks);
  const navigate = useNavigate();

  function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedTerm = useDebounce(searchTerm, 300);

  const handleSelect = useCallback(
    (result: StockResult) => {
      onSelect({ symbol: result.symbol, name: result.description });
      setSearchTerm("");
      setDropdownOpen(false);
      navigate(`/stock-screen?symbol=${encodeURIComponent(result.symbol)}`);
    },
    [onSelect, navigate]
  );

  useEffect(() => {
    if (debouncedTerm.length < 2) {
      setDropdownOpen(false);
    } else {
      setDropdownOpen(true); // Ensure dropdown opens when search term length is sufficient
      void searchStocks({ searchTerm: debouncedTerm });
    }
  }, [debouncedTerm]);

  useEffect(() => {
    if (data) {
      setResults(data);
      setDropdownOpen(!fetching && data.length > 0);
    } else {
      setResults([]);
      setDropdownOpen(false);
    }
  }, [data, fetching]);

  return (
    <div className={cn("relative w-full", className)}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for stocks..."
          className="w-full h-17 text-2xl p-5" // Input width and styling
        />
        <DropdownMenuTrigger asChild>
          <p className="text-xs">-</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-w-lg" align="start">
          {error && (
            <div className="p-2 text-md text-red-500"> {/* Error state */}
              Error: {error.message || "Failed to search stocks"}
            </div>
          )}
          {!fetching && !error && results.length === 0 && (
            <div className="p-2 text-md text-gray-500"> {/* No results found */}
              No results found
            </div>
          )}
          {!fetching &&
            !error &&
            results.slice(0, 6).map((result) => ( // Limit to top 6 results
              <button
                key={result.symbol}
                className="w-full max-w-[704px] p-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none" // Result item styling
                onClick={() => handleSelect(result)}
              >
                <div className="font-medium text-md">{result.symbol}</div> {/* Symbol font size */}
                <div className="text-md text-gray-600">{result.description}</div> {/* Description font size */}
                {result.type && <div className="text-sm text-gray-400">{result.type}</div>} {/* Type */}
              </button>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
