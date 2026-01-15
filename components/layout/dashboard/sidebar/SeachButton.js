"use client";

import {
  Plus,
  File,
  Users,
  Globe,
  Search,
  LayoutGrid,
  LoaderCircle,
  MessageCircle,
} from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";

import SearchDialog from "./SearchDialog";

const INITIAL_QUICK_ACTIONS = [
  {
    id: "0",
    title: "New App",
    category: "Quick Actions",
    icon: <Plus />,
    redirect: `/dashboard`,
  },

  {
    id: "1",
    title: "Apps",
    category: "Quick Actions",
    icon: <LayoutGrid />,
    redirect: `/apps`,
  },

  {
    id: "2",
    title: "Templates",
    category: "Quick Actions",
    icon: <Globe />,
    redirect: `/templates`,
  },

  {
    id: "3",
    title: "Team",
    category: "Quick Actions",
    icon: <Users />,
    redirect: `/team`,
  },

  {
    id: "4",
    title: "Files",
    category: "Quick Actions",
    icon: <File />,
    redirect: `/files`,
  },
];

const SearchButton = ({
  placeholder = "Search...",
  onSelect,
  buttonLabel = "Search",
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState(INITIAL_QUICK_ACTIONS);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRecentAppsData = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/recent`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recent apps");
      }

      const data = await response.json();

      const items =
        data?.workspaces?.map((workspace) => ({
          id: String(workspace?.id),
          title: workspace?.name,
          category: "Recent Apps",
          icon: <MessageCircle />,
          redirect: `/editor/${workspace?.id}`,
        })) || [];

      setResults([...INITIAL_QUICK_ACTIONS, ...items]);
    } catch (err) {
      console.error("Error fetching recent apps:", err);
      setError("Could not load recent apps. Please try again.");
      setResults(INITIAL_QUICK_ACTIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getRecentAppsData();
  }, [getRecentAppsData]);

  const handleOpenDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const handleRetry = useCallback(() => {
    getRecentAppsData();
  }, [getRecentAppsData]);

  const buttonClassName = useMemo(() => {
    return "flex gap-2 bg-transparent font-normal shadow-none [:hover,[data-pressed]]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60";
  }, []);

  const showLoadingInButton =
    isLoading && results.length <= INITIAL_QUICK_ACTIONS.length;

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpenDialog}
        disabled={isLoading && results.length <= INITIAL_QUICK_ACTIONS.length}
        className={buttonClassName}
        aria-label={showLoadingInButton ? "Loading search data" : "Open search"}
      >
        {showLoadingInButton ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          <Search aria-hidden="true" />
        )}
        {buttonLabel}
      </Button>

      <SearchDialog
        open={open}
        setOpen={setOpen}
        results={results}
        onSelect={onSelect}
        onRetry={handleRetry}
        placeholder={placeholder}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        error={error}
        loading={isLoading && results.length <= INITIAL_QUICK_ACTIONS.length}
      />
    </>
  );
};

export default React.memo(SearchButton);
