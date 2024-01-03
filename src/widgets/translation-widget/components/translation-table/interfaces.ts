export interface IGetWebTranslationsTableResult{
    path:string[];
    key:string;
    translations:ITranslationResult[]
}
export interface ITranslationResult{
    lang:string;
    translation:string;
}