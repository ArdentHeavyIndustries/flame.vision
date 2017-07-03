runlocal:
	@echo "Starting server on 127.0.0.1:62832..."
	lighttpd -D -f config/dev.conf

initdb:
	sqlite3 🔥.db < config/initdb.sql

deploy:
	sudo cp -r ./www/* ~fire/www/
	sudo chown -R fire:fire ~fire/www/
