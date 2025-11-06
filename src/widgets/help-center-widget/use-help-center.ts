import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  KnowledgeBaseFolder,
  KnowledgeBaseArticle,
  getFolders,
  getArticlesByFolderId,
  getArticleById,
} from "@/services/api-service/knowledge-base/knowledge-base-api";

export const useHelpCenter = () => {
  const { callApi } = useGomakeAxios();
  const [folders, setFolders] = useState<KnowledgeBaseFolder[]>([]);
  const [folderArticles, setFolderArticles] = useState<Record<number, KnowledgeBaseArticle[]>>({});
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState<Record<number, boolean>>({});

  const fetchFolders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFolders(callApi);
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  }, [callApi]);

  const fetchArticle = useCallback(
    async (articleId: number) => {
      try {
        const data = await getArticleById(callApi, articleId);
        setSelectedArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    },
    [callApi]
  );

  const fetchArticles = useCallback(
    async (folderId: number) => {
      try {
        setArticlesLoading((prev) => ({ ...prev, [folderId]: true }));
        const data = await getArticlesByFolderId(callApi, folderId);
        setFolderArticles((prev) => ({ ...prev, [folderId]: data }));
        // Auto-select first article if none selected
        if (data.length > 0 && !selectedArticle) {
          await fetchArticle(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setArticlesLoading((prev) => ({ ...prev, [folderId]: false }));
      }
    },
    [callApi, selectedArticle, fetchArticle]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchFolders();
      // After folders load, expand first folder and load its articles
      const foldersData = await getFolders(callApi);
      if (foldersData.length > 0) {
        setExpandedFolders(new Set([foldersData[0].id]));
        const articlesData = await getArticlesByFolderId(callApi, foldersData[0].id);
        setFolderArticles((prev) => ({ ...prev, [foldersData[0].id]: articlesData }));
        if (articlesData.length > 0) {
          await fetchArticle(articlesData[0].id);
        }
      }
    };
    loadInitialData();
  }, [callApi, fetchFolders, fetchArticle]);

  const toggleFolder = useCallback(
    async (folderId: number) => {
      setExpandedFolders((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(folderId)) {
          newSet.delete(folderId);
        } else {
          newSet.add(folderId);
          // Fetch articles if not already loaded
          if (!folderArticles[folderId]) {
            fetchArticles(folderId);
          }
        }
        return newSet;
      });
    },
    [folderArticles, fetchArticles]
  );

  const handleArticleClick = async (article: KnowledgeBaseArticle) => {
    await fetchArticle(article.id);
  };

  return {
    folders,
    folderArticles,
    expandedFolders,
    selectedArticle,
    loading,
    articlesLoading,
    toggleFolder,
    handleArticleClick,
    setSelectedArticle,
  };
};

