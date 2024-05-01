const LoginTaxesUrl = "http://tax-service-env.eba-ipv4kk6u.il-central-1.elasticbeanstalk.com/login/";
const TaxesUrl = "http://tax-service-env.eba-ipv4kk6u.il-central-1.elasticbeanstalk.com/";
async function fetchTaxesAuthority(objKey) {
    const response = await fetch(`${TaxesUrl}${objKey}`);
    const data = await response.json();
    return data;
}
export { fetchTaxesAuthority , LoginTaxesUrl }