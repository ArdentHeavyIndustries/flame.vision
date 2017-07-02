runlocal:
	mkdir -p httpd
	echo "Starting server on 127.0.0.1:62830..."
	httpd -DFOREGROUND -X -f config/devhost.conf -d `pwd`
