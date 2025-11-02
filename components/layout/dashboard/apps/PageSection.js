"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PageSection({
  totalPages,
  page,
  query,
  teamId,
  totalWorkspaces,
  route = "apps",
  topLimit = 10,
}) {
  const router = useRouter();

  if (totalWorkspaces <= topLimit) return null;

  const currentPage = parseInt(page) || 1;

  const buildUrl = (pageNum) => {
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }
    if (pageNum > 1) {
      params.set("p", pageNum.toString());
    }
    const queryString = params.toString();
    return `/${route}${queryString ? `?${queryString}` : ""}`;
  };

  const handlePageChange = (pageNum, e) => {
    e.preventDefault();
    router.push(buildUrl(pageNum));
  };

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="my-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildUrl(currentPage - 1)}
            onClick={(e) => {
              if (currentPage === 1) {
                e.preventDefault();
                return;
              }
              handlePageChange(currentPage - 1, e);
            }}
            aria-disabled={currentPage === 1}
            className={cn(
              "text-xs data-pressed:bg-foreground/5 hover:bg-foreground/5",
              {
                "pointer-events-none opacity-50": currentPage === 1,
              }
            )}
          />
        </PaginationItem>

        {pageNumbers.map((pageNum, index) => (
          <PaginationItem key={`${pageNum}-${index}`}>
            {typeof pageNum === "number" ? (
              <PaginationLink
                href={buildUrl(pageNum)}
                onClick={(e) => handlePageChange(pageNum, e)}
                isActive={pageNum === currentPage}
                className={cn(
                  "text-xs data-pressed:bg-foreground/5 hover:bg-foreground/5"
                )}
              >
                {pageNum}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={buildUrl(currentPage + 1)}
            onClick={(e) => {
              if (currentPage === totalPages) {
                e.preventDefault();
                return;
              }
              handlePageChange(currentPage + 1, e);
            }}
            aria-disabled={currentPage === totalPages}
            className={cn(
              "text-xs data-pressed:bg-foreground/5 hover:bg-foreground/5",
              {
                "pointer-events-none opacity-50": currentPage === totalPages,
              }
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
