const { Roles } = require('../models')

exports.create = (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).send("Missing name");
    }

    const Role = new Roles({
        "name": req.body.name
    });

    Roles.findOne({ name })
        .then(data => {
            if (data) {
                throw new Error("Role already exists")
            }

            return Role.save(Role)
        })
        .then(data => res.status(201).json(data))
        .catch(err =>
            res.status(400).send({
                message:
                    err.message || "Some error occurred while creating the Role."
            })
        )
}

exports.findAll = (req, res) => {
    Roles.find({})
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).send({
                message:
                    err.message || "Some error occurred while creating the Role."
            })
        })
}

exports.findByName = (req, res) => {
    const { name } = req.params.name;

    if (!name) {
        res.status(400).send("Missing required fields");
    }

    Roles.find({ name })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).send({
                message:
                    err.message || "Some error occurred while creating the Role."
            })
        })
}

exports.delete = (req, res) => {
    const name = req.params.name;

    Roles.findOneAndDelete(name, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Role with id=${id}. Maybe Role was not found!`
                });
            } else res.send({ message: "Role Removed successfully." });
        })
        .catch(err => {
            res.status(400).send({
                message:
                    err.message || "Some error occurred while removing the Role."
            })
        })
}