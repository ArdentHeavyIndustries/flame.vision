#!/usr/bin/lua
print("Content-Type: application/json; charset=utf-8\n")
drv = require "luasql.sqlite3"
dbenv = drv.sqlite3()
db = dbenv:connect("../🔥.db")
cur = db:execute("SELECT * FROM leaders ORDER BY avg desc LIMIT 10")
res = cur:fetch({}, "a")
print("{")
print("    \"leaders\": [")
while res do
    print(string.format("        { \"name\": \"%s\", \"average\": \"%s\" },", res.player, res.avg))
    res = cur:fetch(res, "a")
end
print("        \"end\"")
print("    ],")
print("    \"end\": \"true\"")
print("}")
db:close()
dbenv:close()
