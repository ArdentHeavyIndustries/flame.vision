#!/usr/bin/lua
query = os.getenv("QUERY_STRING")
if (query == nil or query == '') then
    os.exit()
end

--k = query:sub(1, query:find("="))
k = query:sub(1, query:find("=")-1)
v = query:sub(query:find("=")+1)

--print(string.format("k = %s, v = %s", k, v))

if k == "running" then
    drv = assert(require "luasql.sqlite3")
    dbenv = assert(drv.sqlite3())
    db = assert(dbenv:connect("../../🔥.db"))
    if v == "true" then
        sql = "DELETE FROM status WHERE thing=\"running\";"
        res = db:execute(sql)
        sql = "INSERT INTO status VALUES(\"running\", \"true\");"
        res = db:execute(sql)
    else
        sql = "DELETE FROM status WHERE thing=\"running\";"
        db:execute(sql)
        sql = "INSERT INTO status VALUES(\"running\", \"false\");"
        db:execute(sql)
    end
    db:close()
    dbenv:close()
    print("")
    return
end

if k == "currentplayer" then
    drv = assert(require "luasql.sqlite3")
    dbenv = assert(drv.sqlite3())
    db = assert(dbenv:connect("../../🔥.db"))
    sql = "DELETE FROM status WHERE thing=\"currentplayer\";"
    db:execute(sql)
    sql = string.format("INSERT INTO status VALUES(\"currentplayer\", \"%s\");", v)
    db:execute(sql)
    db:close()
    dbenv:close()
    print("")
    return
end

if k == "resetscoreboard" then
    drv = assert(require "luasql.sqlite3")
    dbenv = assert(drv.sqlite3())
    db = assert(dbenv:connect("../../🔥.db"))
    sql = "DELETE FROM leaders;"
    db:execute(sql)
    db:close()
    dbenv:close()
    print("We've reset the scoreboard")
    return
end
os.exit()
