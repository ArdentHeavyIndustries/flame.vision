runlocal:
	@echo "Starting server on 127.0.0.1:62832..."
	lighttpd -D -f config/dev.conf

initdb:
	sqlite3 🔥.db < config/initdb.sql

initpasswd:
	htdigest -c passwd 'Welcome to the Fire Realm.' admin

deploy:
	sudo cp -r ./www/* ~fire/www/
	sudo chown -R fire:fire ~fire/www/
