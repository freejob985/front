import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function CartIcon() {
  const { data, error } = useQuery({ 
    queryKey: ["cart", "count"], 
    queryFn: api.cart.count, 
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always refetch to get latest count
    retry: 1,
    onError: (err) => {
      console.error('Error fetching cart count:', err);
    }
  });
  
  const count = data?.count ?? 0;
  
  // If there's an error, show a simple cart icon without count
  if (error) {
    return (
      <Link to="/cart">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </Link>
    );
  }
  
  return (
    <Link to="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
          {count}
        </Badge>
      </Button>
    </Link>
  );
}
