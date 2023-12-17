const S3Url = "https://gomake-translations.s3.eu-central-1.amazonaws.com/";
async function  fetchS3JsonTranslation(objKey){
    const response = await fetch(`${S3Url}${objKey}`);
    const data = await response.json();
    return data;
}
export {fetchS3JsonTranslation}