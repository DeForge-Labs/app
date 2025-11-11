"use client";

import {
  Plus,
  Users,
  Globe,
  Search,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import SearchDialog from "./SearchDialog";

const RESULTS = [
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
];

const SearchButton = ({
  placeholder = "Search...",
  onSelect,
  buttonLabel = "Search",
}) => {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState(RESULTS);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getRecentAppsData();

    return () => {
      setSearchValue("");
      setResults(RESULTS);
    };
  }, []);

  const getRecentAppsData = async () => {
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

      const data = await response.json();

      const items = data?.workspaces?.map((workspace) => ({
        id: workspace?.id,
        title: workspace?.name,
        category: "Recent Apps",
        icon: <MessageCircle />,
        redirect: `/editor/${workspace?.id}`,
      }));

      setResults([...RESULTS, ...(items || [])]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex gap-2 bg-transparent font-normal shadow-none [:hover,[data-pressed]]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
      >
        <Search />
        {buttonLabel}
      </Button>

      <SearchDialog
        open={open}
        setOpen={setOpen}
        results={results}
        onSelect={onSelect}
        placeholder={placeholder}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    </>
  );
};

export default SearchButton;
