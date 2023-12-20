const S3Url = "https://gomake-translations.s3.eu-central-1.amazonaws.com/web/";

async function fetchS3JsonTranslation(objKey) {
    const timestamp = new Date().getTime();
    const response = await fetch(`${S3Url}${objKey}?timestamp=${timestamp}`);
    const data = await response.json();
    return data;
}
export {fetchS3JsonTranslation}