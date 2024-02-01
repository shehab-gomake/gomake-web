import {useGomakeAxios} from "@/hooks";
import {useEffect, useState} from "react";
import {getWebTranslationsTable} from "@/services/api-service/aws-s3/get-web-translations-table";
import {
  IGetWebTranslationsTableResult,
  ITranslationResult,
} from "@/widgets/translation-widget/components/translation-table/interfaces";
import {TextareaAutosize} from "@mui/base/TextareaAutosize";
import {updateWebTranslationsTable} from "@/services/api-service/aws-s3/update-web-translations-table";
import {ETranslationSource} from "@/widgets/translation-widget/enums";

const useTranslationsTable = (translationSource:ETranslationSource) => {
  const { callApi } = useGomakeAxios();
  const [translationsTableHeaders, setTranslationsTableHeaders] =
    useState<string[]>();
  const [translationsTableData, setTranslationsTableData] =
    useState<IGetWebTranslationsTableResult[]>();
  const [translationsTableRows, setTranslationsTableRows] = useState<any>();
  const [totalPages, setTotalPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [hasTextChanged, setHasTextChanged] = useState(false);
  const updateTranslation = (e, path, key, lang) => {
    const value = e.target.value;
    const updateObj = {
      path: path,
      key: key,
      lang: lang,
      value: value,
    };

    const callBack = (res) => {
      setTranslationsTableData(
        translationsTableData.map((x) => {
          if (x.path === path && x.key === key) {
            const translations: ITranslationResult[] = x.translations.map(
              (y) => {
                if (y.lang === lang) {
                  return {
                    lang: y.lang,
                    translation: value,
                  };
                } else {
                  return y;
                }
              }
            );
            const newRow: IGetWebTranslationsTableResult = {
              path: x.path,
              key: x.key,
              translations: translations,
            };
            return newRow;
          } else {
            return x;
          }
        })
      );
    };
    updateWebTranslationsTable(callApi, callBack, updateObj);
  };
  const handleTranslationChange = (e, path, key, lang) => {
    const value = e.target.value;

    setTranslationsTableData(
      translationsTableData.map((x) => {
        if (x.path === path && x.key === key) {
          const translations = x.translations.map((y) => {
            if (y.lang === lang) {
              return {
                lang: y.lang,
                translation: value,
              };
            } else {
              return y;
            }
          });
          const newRow = {
            path: x.path,
            key: x.key,
            translations: translations,
          };
          return newRow;
        } else {
          return x;
        }
      })
    );

    setHasTextChanged(true);
  };
  useEffect(() => {
    if (translationsTableData && translationsTableData.length > 0) {
      let headers = ["path", "key"];
      if(translationSource !== ETranslationSource.WEB){
        headers = [ "key"];
      }
      
      translationsTableData[0].translations.forEach((x) => {
        headers.push(x.lang);
      });
      setTranslationsTableHeaders(headers);

      const rows = translationsTableData.map((dataRow) => {
        let baseColumns  = [dataRow.path && dataRow.path.length > 0 ? dataRow.path.join(".") : "", dataRow.key]
        if(translationSource !== ETranslationSource.WEB){
          baseColumns = [  dataRow.key];
        }
        return [
            ...baseColumns,
          ...dataRow.translations.map((header) => (
            <TextareaAutosize
              value={header.translation}
              onChange={(e) =>
                handleTranslationChange(
                  e,
                  dataRow.path,
                  dataRow.key,
                  header.lang
                )
              }
              onBlur={(e) => {
                if (hasTextChanged) {
                  updateTranslation(e, dataRow.path, dataRow.key, header.lang);
                  setHasTextChanged(false); // Reset the state after the update
                }
              }}
            />
          )),
        ];
      });
      setTranslationsTableRows(rows);
    }
  }, [translationsTableData]);
  const getTranslationsTable = () => {
    const callBack = (res) => {
      const data = res.data.data as IGetWebTranslationsTableResult[];
      setTranslationsTableData(data);
      setTotalPages(res.data.totalPages);
    };
    getWebTranslationsTable(callApi, callBack, {
      page: currentPage,
      filter: searchFilter,
    });
  };

  return {
    getTranslationsTable,
    totalPages,
    translationsTableHeaders,
    translationsTableRows,
    currentPage,
    setCurrentPage,
    searchFilter,
    setSearchFilter,
  };
};
export { useTranslationsTable };
