const rtns = require("./utilities");
const got = require("got");

const { governmentAlertsJson, webCountriesJson, alerts } = require("./config");

const loadAlerts = async () => {
    let results = ``;
    try {
        db = await rtns.getDBInstance();
        let resultsDelete = await rtns.deleteAll(db, alerts);
        results += `deleted ${resultsDelete.deletedCount} documents from the ${alerts} collection. `;

        let countriesJson = await got(webCountriesJson).json();
        results += `Retrieved country JSON from remote web site. `;

        let alertJson = await got(governmentAlertsJson).json();
        results += `Retrieved Alret JSON from remote web site. `;

        let resultArray = await Promise.allSettled(
            countriesJson.map((country) => {
                let alertForCountry = alertJson.data[country["alpha-2"]];
                let advisoryTextFromAlerts;
                let dateFromAlerts;
                if (alertForCountry === undefined) {
                    advisoryTextFromAlerts = "No travel alerts";
                    dateFromAlerts = "";
                } else {
                    advisoryTextFromAlerts =
                        alertForCountry.eng["advisory-text"];
                    dateFromAlerts = alertForCountry["date-published"].date;
                }
                return rtns.addOne(db, alerts, {
                    country: country["alpha-2"],
                    name: country.name,
                    text: advisoryTextFromAlerts,
                    date: dateFromAlerts,
                    region: country.region,
                    subregion: country["sub-region"],
                });
            })
        );

        results += `Added approximately ${resultArray.length} new documents to the ${alerts} collection. `;
    } catch (err) {
        console.log(err);
    } finally {
        return {results: results};
    }
};

module.exports = {loadAlerts};
