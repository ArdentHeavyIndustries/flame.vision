#!/usr/bin/lua
print("Content-Type: application/json; charset=utf-8\n")
drv = require "luasql.sqlite3"
dbenv = drv.sqlite3()
db = dbenv:connect("../🔥.db")
cur = db:execute("SELECT * FROM status")
res = cur:fetch({}, "a")
print("{")
while res do
    print(string.format("    \"%s\":\"%s\",", res.thing, res.value))
    res = cur:fetch(res, "a")
end
print("    \"end\":\"true\"")
print("}")
db:close()
dbenv:close()
