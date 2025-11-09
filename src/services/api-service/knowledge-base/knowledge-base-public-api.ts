import axios from "axios";
import config from "@/config";

export interface KnowledgeBaseFolder {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseArticle {
  id: number;
  folderId: number;
  title: string;
  content: string; // HTML content
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const getPublicApiInstance = () => {
  const baseURL = config.api_server || "http://localhost:3000";
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getFoldersPublic = async (): Promise<KnowledgeBaseFolder[]> => {
  const api = getPublicApiInstance();
  const res = await api.get("/api/knowledge-base/folders");
  return res?.data || [];
};

export const getFolderByIdPublic = async (id: number): Promise<KnowledgeBaseFolder> => {
  const api = getPublicApiInstance();
  const res = await api.get(`/api/knowledge-base/folders/${id}`);
  return res?.data;
};

export const getArticlesPublic = async (folderId?: number): Promise<KnowledgeBaseArticle[]> => {
  const api = getPublicApiInstance();
  const params: any = {};
  if (folderId) {
    params.folderId = folderId;
  }
  const res = await api.get("/api/knowledge-base/articles", { params });
  return res?.data || [];
};

export const getArticleByIdPublic = async (id: number): Promise<KnowledgeBaseArticle> => {
  const api = getPublicApiInstance();
  const res = await api.get(`/api/knowledge-base/articles/${id}`);
  return res?.data;
};

export const getArticlesByFolderIdPublic = async (
  folderId: number
): Promise<KnowledgeBaseArticle[]> => {
  const api = getPublicApiInstance();
  const res = await api.get(`/api/knowledge-base/folders/${folderId}/articles`);
  return res?.data || [];
};
