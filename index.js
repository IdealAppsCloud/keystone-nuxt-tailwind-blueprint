const { Keystone } = require('@keystonejs/keystone');
const { Text } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { NuxtApp } = require('@keystonejs/app-nuxt');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');

const PROJECT_NAME = 'some-project';
const adapterConfig = { mongoUri: 'mongodb://localhost/some-project' };


const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
});

const { userIsAdmin, userIsAdminOrOwner } = require('./auth/Acl')

keystone.createList('Todo', {
  schemaDoc: 'A list of things which need to be done',
  access: {
    read: true,
    update: userIsAdminOrOwner,
    create: true,
    delete: true,
    auth: true,
  },
  fields: {
    name: { type: Text, schemaDoc: 'This is the thing you need to do' },
  },
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp(),
    new NuxtApp({
      srcDir: 'src',
      buildDir: 'dist',
      buildModules: [
        '@nuxtjs/tailwindcss'
      ],
      build: {
        babel: {
          // envName: server, client, modern
          presets() {
            return [
              [
                '@nuxt/babel-preset-app',
                {
                  useBuiltIns: "entry"
                }
              ]
            ]
          },
        }
      },
      plugins: [
        '~plugins/graphqlClient.js'
      ]
    }),
  ],
};
