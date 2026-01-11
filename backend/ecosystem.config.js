module.exports = {
  apps: [{
    name: 'maisongiel-backend',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
}
