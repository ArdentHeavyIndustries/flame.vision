#!/usr/bin/lua
print("Content-Type: application/json\n")
drv = require "luasql.sqlite3"
dbenv = drv.sqlite3()
db = dbenv:connect("../🔥.db")
cur = db:execute("SELECT * FROM leaders ORDER BY avg desc LIMIT 10")
res = cur:fetch({}, "a")
print("{")
while res do
    print(string.format("    \"%s\":\"%s\"", res.player, res.avg))
    res = cur:fetch(res, "a")
end
print("}")
db:close()
dbenv:close()
