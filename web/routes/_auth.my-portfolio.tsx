import { useState } from "react";
import { Input } from "@/components/ui/input"; 
import { Link } from "@remix-run/react";
import { api } from "../api"; 
import { useFindMany, useUser, useAction } from "@gadgetinc/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, RefreshCcw } from "lucide-react";

export default function MyPortfolio() {
  const [search, setSearch] = useState("");
  const user = useUser();

  //Filters by Stocks pinned by user + search filtering
  const [{ data, fetching, error }, refetch] = useFindMany(api.subscribedStocks, {
    sort: { createdAt: "Descending" },
    filter: {
      ...(search ? {
        AND: [{
          pinnedById: { equals: user.id },
          StockID: { startsWith: search }
        }]
      } : {
        pinnedById: { equals: user.id }
      })
    }
  });
  
  const [{fetching: isDeleting}, deleteStock] = useAction(api.subscribedStocks.delete);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Welcome to Your Portfolio</h1>
      <div className="w-full max-w-sm">
        <Input
          type="text"
          placeholder="Search by Stock ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-8">
        {fetching && (
          <Card>
            <CardContent className="p-4">
              <div className="h-32 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="text-red-600">
                Error loading portfolio: {error.toString()}
              </div>
            </CardContent>
          </Card>
        )}

        {!fetching && !error && data && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Stock ID</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change %</TableHead>
                  <TableHead className="text-right">Price change</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
                
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No stocks found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((stock) => (
                    <TableRow key={stock.id} className="group hover:bg-accent">
                      <TableCell>
                        <Link 
                          to={`/stock-screen?symbol=${stock.StockID}`}
                          className="font-medium hover:underline"
                        >
                          {stock.StockID}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        ${stock.StockPrice?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${stock.PriceChange?.toFixed(2)}
                      </TableCell>
                      <TableCell 
                        className={`text-right ${
                          stock.Change && stock.Change > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stock.Change?.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => {
                            void deleteStock({ id: stock.id });
                          }}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
