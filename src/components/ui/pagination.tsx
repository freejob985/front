import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  lastPage, 
  onPageChange, 
  className = "" 
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(lastPage, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Button
        key={i}
        variant={i === currentPage ? "default" : "outline"}
        size="sm"
        onClick={() => onPageChange(i)}
        className="min-w-[40px]"
      >
        {i}
      </Button>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}