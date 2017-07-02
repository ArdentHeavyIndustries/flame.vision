# flame.vision Server Configuration

## Host and User Configuration
 
#### Login as root

Add the `ardent` user and give it `sudo`ers permissions

	adduser ardent
	usermod -aG sudo ardent
 
The rest of this script is as the `ardent` user.

#### Configure the hostname

	sudo hostnamectl set-hostname flame.vision

#### Update the system

Some part of the stack doesn’t like connecting to the debian repositories over ipv6. Fix this by preferring ipv4.

	sudo vim /etc/gai.conf
	
Find this section and uncomment the last line
	
	#    For sites which prefer IPv4 connections change the last line to
	#
	precedence ::ffff:0:0/96  100
	
Update the system.

	sudo apt-get update
	sudo apt-get upgrade
	
## Install and Configure Apache

	sudo apt-get install apache2 apache2-doc apache2-utils
 
#### Configure apache

Disable the default server and create a named virtual host for `flame.vision`.

	sudo a2dissite 000-default
	cd /var/www/html
	sudo mkdir flame.vision
	sudo mkdir -p flame.vision/public_html
	sudo mkdir -p flame.vision/log
	
Copy `config/Apache Virtual Host.conf` to `/etc/apache2/sites-available/flame.vision.conf`.

	sudo a2ensite flame.vision.conf
	sudo service apache2 restart
 
#### Secure the connection

Install certbot.

	sudo apt-get install python-certbot-apache
	
Configure TLS.

   sudo certbot --apache
   sudo vim /etc/apache2/sites-available/flame.vision.conf
   
When prompted, choose the following options:

1. Activate HTTPS for both `flame.vision` and `www.flame.vision`.
2. Add an administrative email.
3. Accept the TOS.
4. Require HTTPS for all connections.
