FROM php:8.1-apache

# Install extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
  && docker-php-ext-install pdo pdo_mysql mysqli mbstring exif pcntl gd

# Enable mod_rewrite
RUN a2enmod rewrite

# Set working dir
WORKDIR /var/www/html

# Ensure www-data owns files
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
