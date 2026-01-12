module.exports = async (guild, userId, roleId) => {
  const member = await guild.members.fetch(userId);
  await member.roles.add(roleId);
};