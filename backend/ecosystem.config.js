module.exports = {
  apps: [
    {
      name: 'Adoption_Tree_API',
      instances: 0,
      exec_mode: 'cluster',
      script: './bin/www',
      env: {
        NODE_ENV: 'development',
        PORT: 3350,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 4450,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3350,
      },
    },
  ],
};
