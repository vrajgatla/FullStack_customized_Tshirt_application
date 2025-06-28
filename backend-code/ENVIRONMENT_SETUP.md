# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the backend-code directory with the following variables:

### Database Configuration
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=customizedtrends
DB_USERNAME=root
DB_PASSWORD=your_secure_password_here
DB_USE_SSL=true
```

### JWT Configuration
```bash
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here_make_it_at_least_256_bits
JWT_EXPIRATION=86400000
```

### Application Configuration
```bash
SHOW_SQL=false
HIBERNATE_SQL_LOG=INFO
HIBERNATE_BINDER_LOG=INFO
```

### Security Configuration
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password
```

### CORS Configuration
```bash
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
```

## Security Best Practices

1. **Never commit sensitive data** to version control
2. **Use strong passwords** for database and admin accounts
3. **Generate a secure JWT secret** (at least 256 bits)
4. **Enable SSL** for database connections in production
5. **Restrict CORS origins** to your actual domains
6. **Use environment-specific configurations**

## Production Deployment

For production deployment:

1. Set all environment variables with production values
2. Use a proper database (not H2)
3. Enable SSL everywhere
4. Set up proper logging
5. Configure rate limiting
6. Set up monitoring and health checks 