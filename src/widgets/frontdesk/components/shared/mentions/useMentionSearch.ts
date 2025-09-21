import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useGomakeAxios } from "@/hooks";
import { getAllDocumentsApi } from "@/services/api-service/generic-doc/documents-api";
import { getAllReceiptsApi } from "@/services/api-service/generic-doc/receipts-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import type { MentionCategory, MentionGroup, MentionItem } from "./types";

type UseMentionSearchArgs = {
  query: string;
  category: MentionCategory;
};

type UseMentionSearchReturn = {
  query: string;
  category: MentionCategory;
  results: MentionGroup[];
  loading: boolean;
  error: string | null;
  setQuery: (q: string) => void;
  setCategory: (c: MentionCategory) => void;
};

export const useMentionSearch = (initial: UseMentionSearchArgs): UseMentionSearchReturn => {
  const { callApi } = useGomakeAxios();
  const [query, setQuery] = useState<string>(initial.query ?? "");
  const [category, setCategory] = useState<MentionCategory>(initial.category ?? "all");
  const [results, setResults] = useState<MentionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedCallback(async () => {
    const trimmed = (query || "").trim();

    setLoading(true);
    setError(null);

    try {
      const groups: MentionGroup[] = [];

      const runClients = async (clientType: CLIENT_TYPE, search?: string) => {
        // Use GET endpoint with query parameters
        const params = new URLSearchParams({
          clientType: clientType === CLIENT_TYPE.CUSTOMER ? "C" : "S",
          pageNumber: "1",
          pageSize: "10",
          name: search || "",
          isActive: "true"
        });

        console.log(`Fetching ${clientType === CLIENT_TYPE.CUSTOMER ? 'clients' : 'suppliers'} with params:`, params.toString());

        const res = await callApi("GET", `/v1/customers/get-customers-pagination?${params.toString()}`, {}, false);

        console.log(`${clientType === CLIENT_TYPE.CUSTOMER ? 'Clients' : 'Suppliers'} full response:`, res);

        // The response structure has data.data.data.data for the array
        // or data.data.data which contains {data: Array, totalItems: number}
        const dataContainer = res?.data?.data?.data || {};
        const list = dataContainer.data || dataContainer || [];

        console.log(`${clientType === CLIENT_TYPE.CUSTOMER ? 'Clients' : 'Suppliers'} extracted list:`, list);

        const items: MentionItem[] = (Array.isArray(list) ? list : []).map((c: any) => ({
          id: c.id || c._id || c.customerId || c.code || String(c.name),
          label: c.name || c.customerName || c.supplierName || c.title || "Unknown",
          category: clientType === CLIENT_TYPE.CUSTOMER ? "clients" : "suppliers",
          raw: c,
        }));

        console.log(`${clientType === CLIENT_TYPE.CUSTOMER ? 'Clients' : 'Suppliers'} final items:`, items);

        return items;
      };

      const runInvoices = async (search?: string) => {
        const callBack = (_res: any) => {};
        const res = await getAllDocumentsApi(callApi, callBack, {
          documentType: DOCUMENT_TYPE.invoice,
          data: {
            ...(search ? { patternSearch: search } : {}),
            model: { pageNumber: 1, pageSize: 10 },
          },
        });
        const docs = res?.data?.data || [];
        const items: MentionItem[] = docs.map((d: any) => ({
          id: d.id || d.documentId || d.number,
          label: d.number ? `Invoice #${d.number}` : "Invoice",
          sublabel: d.clientName || d.customerName || undefined,
          category: "invoices",
          raw: d,
        }));
        return items;
      };

      const runReceipts = async (search?: string) => {
        const callBack = (_res: any) => {};
        const res = await getAllReceiptsApi(callApi, callBack, {
          ...(search ? { patternSearch: search } : {}),
          model: { pageNumber: 1, pageSize: 10 },
        });
        const recs = res?.data?.data || [];
        const items: MentionItem[] = recs.map((r: any) => ({
          id: r.id || r.receiptId || r.receiptNumber,
          label: r.receiptNumber ? `Receipt #${r.receiptNumber}` : "Receipt",
          sublabel: r.clientName || r.customerName || undefined,
          category: "receipts",
          raw: r,
        }));
        return items;
      };

      // Handle search based on category selection
      if (category === "all") {
        // When in "all" mode, show results from all categories
        if (!trimmed) {
          // Empty query: show first 3 items from each category
          const [clients, suppliers, invoices, receipts] = await Promise.all([
            runClients(CLIENT_TYPE.CUSTOMER, undefined),
            runClients(CLIENT_TYPE.SUPPLIER, undefined),
            runInvoices(undefined),
            runReceipts(undefined),
          ]);

          groups.push(
            { title: "Clients", items: clients.slice(0, 3) },
            { title: "Suppliers", items: suppliers.slice(0, 3) },
            { title: "Invoices", items: invoices.slice(0, 3) },
            { title: "Receipts", items: receipts.slice(0, 3) }
          );
        } else {
          // With query: search all categories and show results
          const [clients, suppliers, invoices, receipts] = await Promise.all([
            runClients(CLIENT_TYPE.CUSTOMER, trimmed),
            runClients(CLIENT_TYPE.SUPPLIER, trimmed),
            runInvoices(trimmed),
            runReceipts(trimmed),
          ]);

          // Only show categories that have results
          if (clients.length > 0) groups.push({ title: "Clients", items: clients });
          if (suppliers.length > 0) groups.push({ title: "Suppliers", items: suppliers });
          if (invoices.length > 0) groups.push({ title: "Invoices", items: invoices });
          if (receipts.length > 0) groups.push({ title: "Receipts", items: receipts });
        }
      } else {
        // Specific category selected: search only that category
        const categoryTitles = {
          clients: "Clients",
          suppliers: "Suppliers",
          invoices: "Invoices",
          receipts: "Receipts",
        };

        if (category === "clients") {
          const items = await runClients(CLIENT_TYPE.CUSTOMER, trimmed || undefined);
          groups.push({ title: categoryTitles[category], items });
        } else if (category === "suppliers") {
          const items = await runClients(CLIENT_TYPE.SUPPLIER, trimmed || undefined);
          groups.push({ title: categoryTitles[category], items });
        } else if (category === "invoices") {
          const items = await runInvoices(trimmed || undefined);
          groups.push({ title: categoryTitles[category], items });
        } else if (category === "receipts") {
          const items = await runReceipts(trimmed || undefined);
          groups.push({ title: categoryTitles[category], items });
        }
      }

      setResults(groups);
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, 250);

  useEffect(() => {
    setLoading(true);
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, category]);

  return {
    query,
    category,
    results,
    loading,
    error,
    setQuery,
    setCategory,
  };
};
