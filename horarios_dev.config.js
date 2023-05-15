module.exports = {
  apps : [
	{
    script: './dist/main.js',
    watch: '.',
	env: {
		NODE_ENV:'dev',
		PORT:3050,
		API_KEY:12345,
DATABASE_NAME:'mongodb://localhost:27017',
DATABASE_PORT:3000,
MONGO_CONNECTION:'mongodb+srv',
MONGO_HOST:'cluster0.104hh.mongodb.net',
MONGO_PORT:27017,
MONGO_DB:'horarios_dev',
MONGO_INITDB_ROOT_USERNAME:'user_1',
MONGO_INITDB_ROOT_PASSWORD:'02320434321l',
	},
}, 
],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
