import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { useHelpCenter } from "./use-help-center";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const HelpCenterWidget = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const {
    folders,
    folderArticles,
    expandedFolders,
    selectedArticle,
    loading,
    articlesLoading,
    toggleFolder,
    handleArticleClick,
    setSelectedArticle,
  } = useHelpCenter();

  return (
    <div style={classes.mainContainer}>
      <h1 style={classes.pageTitle}>
        {t("helpCenter.title") || "Help Center"}
      </h1>
      {loading ? (
        <Stack justifyContent="center" alignItems="center" sx={{ py: 8, height: "100%" }}>
          <CircularProgress />
        </Stack>
      ) : (
        <div style={classes.contentWrapper}>
          {/* Left Sidebar */}
          <div style={classes.sidebar}>
            <div style={classes.foldersList}>
              {folders.map((folder) => {
                const isExpanded = expandedFolders.has(folder.id);
                const articles = folderArticles[folder.id] || [];
                const isLoading = articlesLoading[folder.id];

                return (
                  <div key={folder.id} style={classes.folderItem}>
                    <div
                      style={classes.folderHeader}
                      onClick={() => toggleFolder(folder.id)}
                    >
                      {isExpanded ? (
                        <ExpandMoreIcon style={classes.chevronIcon} />
                      ) : (
                        <ChevronRightIcon style={classes.chevronIcon} />
                      )}
                      <span style={classes.folderName}>{folder.name}</span>
                    </div>
                    {isExpanded && (
                      <div style={classes.articlesList}>
                        {isLoading ? (
                          <div style={classes.loadingContainer}>
                            <CircularProgress size={16} />
                          </div>
                        ) : articles.length === 0 ? (
                          <div style={classes.emptyArticles}>
                            {t("helpCenter.noArticles") || "No articles"}
                          </div>
                        ) : (
                          articles.map((article) => (
                            <div
                              key={article.id}
                              style={{
                                ...classes.articleItem,
                                ...(selectedArticle?.id === article.id
                                  ? classes.articleItemSelected
                                  : {}),
                              }}
                              onClick={() => handleArticleClick(article)}
                            >
                              {article.title}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={classes.divider} />

          {/* Right Content Area */}
          <div style={classes.contentArea}>
            {selectedArticle ? (
              <div style={classes.articleContent}>
                <Box sx={classes.articleBodyContent}>
                  <div
                    style={classes.articleBody}
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />
                </Box>
              </div>
            ) : (
              <div style={classes.emptyContent}>
                <div style={classes.emptyContentIcon}>📄</div>
                <div style={classes.emptyContentTitle}>
                  {t("helpCenter.selectArticle") || "Select an article"}
                </div>
                <div style={classes.emptyContentText}>
                  {t("helpCenter.selectArticleDescription") ||
                    "Choose an article from the left sidebar to view its content"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

