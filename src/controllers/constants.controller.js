const { DOMAIN_VALUES, INDUSTRY_VALUES } = require("../config/constants")

exports.docTypes = (req, res) => {
    res.status(STATUSCODE.SUCCESS).send(DOMAIN_VALUES)
}

exports.industries = (req, res) => {
    res.status(STATUSCODE.SUCCESS).send(INDUSTRY_VALUES)
}