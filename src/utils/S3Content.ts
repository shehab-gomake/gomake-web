const S3Url = "https://gomake-contents.s3.eu-west-3.amazonaws.com/";
async function  fetchS3JsonContent(objKey){
    const response = await fetch(`${S3Url}${objKey}`);
    const data = await response.json();
    return data;
}
export {fetchS3JsonContent}