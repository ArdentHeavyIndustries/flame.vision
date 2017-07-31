#!/usr/bin/lua
require "posix"
drv = require "luasql.sqlite3"
dbenv = drv.sqlite3()
while(1) do
    db = dbenv:connect("../🔥.db")
    cur = db:execute("SELECT AVG(rating) FROM rate;")
    avg = cur:fetch()
    cur:close()
    if avg == nil then
        avg = 0
    end
    sql = string.format("DELETE FROM status WHERE thing==\"currentavg\";")
    db:execute(sql)
    sql = string.format("INSERT INTO status VALUES(\"currentavg\", \"%.2f\");", avg)
    db:execute(sql)
    db:close()
    posix.sleep("5")
end
