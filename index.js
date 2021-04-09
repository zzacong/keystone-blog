const { Keystone } = require('@keystonejs/keystone')
const { GraphQLApp } = require('@keystonejs/app-graphql')
const { AdminUIApp } = require('@keystonejs/app-admin-ui')
// const { NextApp } = require('@keystonejs/app-next')
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose')
require('dotenv').config()

const PostSchema = require('./lists/Post')
const UserSchema = require('./lists/User')
const access = require('./access-controls')

const PROJECT_NAME = 'Keystone Blog'
const adapterConfig = { mongoUri: process.env.MONGO_URI }

/**
 * You've got a new KeystoneJS Project! Things you might want to do next:
 * - Add adapter config options (See: https://keystonejs.com/keystonejs/adapter-mongoose/)
 * - Select configure access control and authentication (See: https://keystonejs.com/api/access-control)
 */
const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: process.env.COOKIE_SECRET,
})

keystone.createList('Post', {
  fields: PostSchema.fields,
  access: {
    read: true,
    create: access.isLoggedIn,
    update: access.isLoggedIn,
    delete: access.isLoggedIn,
  },
})
keystone.createList('User', {
  fields: UserSchema.fields,
  access: {
    read: true,
    create: access.isAdmin,
    update: access.isAdmin,
    delete: access.isAdmin,
  },
})

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'email',
    secretField: 'password',
  },
})

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      authStrategy,
      isAccessAllowed: access.isLoggedIn,
    }),
    // new NextApp({ dir: 'app' }),
  ],
}
