const mongoose = require('mongoose');

const RolesSchema = mongoose.Schema(
    {
        "name": String,
        "isActive": {
            "type": Boolean,
            "default": true
        }
    },
    {
        timestamps: true
    }
)

const Roles = mongoose.model('Roles', RolesSchema);

module.exports = Roles;