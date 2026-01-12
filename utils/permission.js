const permissions = require("../config/permissions.json");

module.exports = {
  isOwner: (id) => permissions.owners.includes(id),
  isAdmin: (id) => permissions.admins.includes(id),
  isStaff: (id) =>
    permissions.owners.includes(id) || permissions.admins.includes(id)
};