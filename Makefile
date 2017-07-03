runlocal:
	mkdir -p httpd
	@echo "Starting server on 127.0.0.1:62830..."
	httpd -DFOREGROUND -X -f config/devhost.conf -d `pwd`

initdb:
	sqlite3 🔥.db < config/initdb.sql

deploy:
	sudo cp -r ./www/* ~fire/www/
	sudo chown -R fire:fire ~fire/www/
