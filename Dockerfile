# Use PHP 8.2 with Apache — same stack as the current TMCF server
FROM php:8.2-apache
 
# Install PostgreSQL extension (for Render PostgreSQL)
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql
 
# Enable Apache URL rewriting
RUN a2enmod rewrite
 
# Copy all project files into the container
COPY . /var/www/html/
 
# Set correct permissions
RUN chown -R www-data:www-data /var/www/html
 
EXPOSE 80

