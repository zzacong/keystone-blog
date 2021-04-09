const isAdmin = ({ authentication: { item: user } }) => {
  // console.log(user)
  return !!user && !!user.isAdmin
}

const isLoggedIn = ({ authentication: { item: user } }) => {
  return !!user
}

module.exports = { isAdmin, isLoggedIn }
