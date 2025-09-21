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

export const useMentionSearch = (
  initial: UseMentionSearchArgs
): UseMentionSearchReturn => {
  const { callApi } = useGomakeAxios();
  const [query, setQuery] = useState<string>(initial.query ?? "");
  const [category, setCategory] = useState<MentionCategory>(
    initial.category ?? "all"
  );
  const [results, setResults] = useState<MentionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedCallback(async () => {
    const trimmed = (query || "").trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const groups: MentionGroup[] = [];

      const runClients = async (clientType: CLIENT_TYPE) => {
        const res = await callApi(
          "POST",
          "/v1/crm-service/customer/get-all-customers",
          {
            clientType,
            searchTerm: trimmed,
            model: { pageNumber: 1, pageSize: 10 },
          },
          false
        );
        const list = res?.data?.data?.data || res?.data?.data || [];
        const items: MentionItem[] = (list as any[]).map((c: any) => ({
          id: c.id || c._id || c.customerId || c.code || String(c.name),
          label: c.name,
          category: clientType === CLIENT_TYPE.CUSTOMER ? "clients" : "suppliers",
          raw: c,
        }));
        return items;
      };

      const runInvoices = async () => {
        const callBack = (_res: any) => {};
        const res = await getAllDocumentsApi(callApi, callBack, {
          documentType: DOCUMENT_TYPE.invoice,
          data: {
            patternSearch: trimmed,
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

      const runReceipts = async () => {
        const callBack = (_res: any) => {};
        const res = await getAllReceiptsApi(callApi, callBack, {
          patternSearch: trimmed,
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

      if (category === "clients") {
        const items = await runClients(CLIENT_TYPE.CUSTOMER);
        groups.push({ title: "Clients", items });
      } else if (category === "suppliers") {
        const items = await runClients(CLIENT_TYPE.SUPPLIER);
        groups.push({ title: "Suppliers", items });
      } else if (category === "invoices") {
        const items = await runInvoices();
        groups.push({ title: "Invoices", items });
      } else if (category === "receipts") {
        const items = await runReceipts();
        groups.push({ title: "Receipts", items });
      } else {
        // all
        const [clients, suppliers, invoices, receipts] = await Promise.all([
          runClients(CLIENT_TYPE.CUSTOMER),
          runClients(CLIENT_TYPE.SUPPLIER),
          runInvoices(),
          runReceipts(),
        ]);
        groups.push(
          { title: "Clients", items: clients },
          { title: "Suppliers", items: suppliers },
          { title: "Invoices", items: invoices },
          { title: "Receipts", items: receipts }
        );
      }

      setResults(groups);
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, 400);

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
