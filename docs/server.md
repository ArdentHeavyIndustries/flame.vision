# flame.vision Server Configuration

## Host and User Configuration
 
#### Create the `ardent` user

Add the `ardent` user and give it `sudo`ers permissions

	adduser ardent
	usermod -aG sudo ardent
	
Allow `ardent` to run `sudo` without a password because the password is hilariously annoying to remember.

	visudo

Add this at the bottom:

	# NOPASSWD for ardent user to sudo
	ardent  ALL=(ALL) NOPASSWD: ALL

Restrict `ssh` to only the `ardent` user. Edit `/etc/ssh/sshd_config` and add this at the bottom:

	AllowUsers ardent
	
#### Create the `fire` user

Create the `fire` user.

	adduser fire
 
The rest of this document assumes you're running as `ardent`.

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

Install core tools (for example, for `make`).

	sudo apt-get install build-essential
	
## Install and configure lighttpd

Install lighttpd.

	sudo apt-get install lighttpd
 
#### Get certificates

Install certbot and get certificates.

	sudo apt-get install certbot
	sudo certbot certonly
   
When prompted, choose "Spin up a temporary webserver (standalone)".

#### Create combined .pem for lighttpd

	cat privkey.pem cert.pem > ssl.pem

#### Create a DH group

Because Paul doesn't want a goddamn B on SSL Labs, create a Diffie-Hellman group. As `fire`:

	cd /etc/letsencrypt/live/flame.vision
	openssl dhparam -out /home/fire/dhparams.pem 2048

#### Modify certificate permissions

*I have no idea if there's a better way to do this part.*

TODO

#### Run lighttpd

TODO

## Install flame.vision

#### Install SQLite, Lua

	apt-get sqlite3 sqlite3-doc
	apt-get install lua5.1 lua-json lua-sql-sqlite3 lua-cgi

#### Install git

	sudo apt-get install git
	
#### Checkout the project
	
	cd
	git clone https://github.com/ArdentHeavyIndustries/flame.vision.git

## Deploy flame.vision