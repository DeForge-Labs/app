"use client";

import { useState, useEffect } from "react";

export default function useFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  const getFiles = async (targetPage = 1, searchQuery = "") => {
    setLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/storage/list?page=${targetPage}&limit=10${
          searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : ""
        }`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();
      setFiles(data.files || []);
      setPaginationData(data.pagination);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFiles(page, debouncedQuery);
  }, [page, debouncedQuery]);

  return {
    files,
    loading,
    getFiles,
    query,
    setQuery,
    page,
    setPage,
    paginationData,
  };
}
