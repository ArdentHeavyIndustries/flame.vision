runlocal: initcache
	@echo "Starting server on 127.0.0.1:62832..."
	lighttpd -D -f config/dev.conf

initdb:
	sqlite3 🔥.db < config/initdb.sql

initpasswd:
	htdigest -c passwd 'Welcome to the Fire Realm.' admin

initcache:
	mkdir -p cache

initfire: initdb initpasswd initcache
	sudo chown fire:fire 🔥.db passwd cache
	sudo mv 🔥.db passwd cache ~/fire

deploy:
	sudo cp -r ./www/* ~fire/www/
	sudo chown -R fire:fire ~fire/www/
