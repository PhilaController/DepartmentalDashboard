import { FISCAL_YEAR } from "@/config"

function getFiscalYearTag(fiscalYear) {
    return `FY${fiscalYear.toString().slice(2)}`
}

function getReportTag() {
    return `${getFiscalYearTag(FISCAL_YEAR)}`
}

function getDownloadURL(key) {

    let folder = getReportTag();
    return `https://departmental-dashboard.s3.amazonaws.com/${folder}/${key}.json`;
}

async function fetchAWS(key) {
    let url = getDownloadURL(key);

    try {
        const response = await fetch(url);
        let data = await response.json();
        return data
    } catch (e) {
        console.error(e);
    }
}


export {
    getReportTag,
    getDownloadURL,
    fetchAWS,
    getFiscalYearTag,

}