export interface IGetWebTranslationsTableResult{
    path:string[];
    key:string;
    translations:ITranslationResult[]
    isUpdate?:boolean;
}
export interface ITranslationResult{
    lang:string;
    translation:string;
}