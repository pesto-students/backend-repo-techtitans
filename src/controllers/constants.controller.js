const { DOMAIN_VALUES, INDUSTRY_VALUES } = require("../config/constants")

exports.docTypes = (req, res) => {
    res.status(200).send(DOMAIN_VALUES)
}

exports.industries = (req, res) => {
    res.status(200).send(INDUSTRY_VALUES)
}