import { useGomakeAxios } from "@/hooks/use-gomake-axios";

export interface KnowledgeBaseFolder {
  id: number;
  name: string;
  description?: string;
  createdBy: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseArticle {
  id: number;
  folderId: number;
  title: string;
  content: string; // HTML content
  slug: string;
  createdBy: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const getFolders = async (callApi: any): Promise<KnowledgeBaseFolder[]> => {
  const res = await callApi("GET", "/api/knowledge-base/folders");
  return res?.data || [];
};

export const getFolderById = async (callApi: any, id: number): Promise<KnowledgeBaseFolder> => {
  const res = await callApi("GET", `/api/knowledge-base/folders/${id}`);
  return res?.data;
};

export const getArticles = async (callApi: any, folderId?: number): Promise<KnowledgeBaseArticle[]> => {
  const params: any = {};
  if (folderId) {
    params.folderId = folderId;
  }
  const res = await callApi("GET", "/api/knowledge-base/articles", params);
  return res?.data || [];
};

export const getArticleById = async (callApi: any, id: number): Promise<KnowledgeBaseArticle> => {
  const res = await callApi("GET", `/api/knowledge-base/articles/${id}`);
  return res?.data;
};

export const getArticlesByFolderId = async (
  callApi: any,
  folderId: number
): Promise<KnowledgeBaseArticle[]> => {
  const res = await callApi("GET", `/api/knowledge-base/folders/${folderId}/articles`);
  return res?.data || [];
};

