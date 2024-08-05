module.exports = {
    apps: [
      {
        name: 'jcwd270403-web',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: 2703,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/jcwd270403.purwadhikabootcamp.com/apps/web',
      },
      {
        name: 'jcwd270403-api',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: 2803,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/jcwd270403.purwadhikabootcamp.com/apps/api',
      },
    ],
}
