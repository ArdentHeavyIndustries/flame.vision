#!/usr/bin/lua

--hex2char for urldecode
function hex2char(hex)
    return string.char(tonumber(hex, 16))
end

--urldecode
function urldecode(s)
    if(s == nil) then
        return
    end
    return s:gsub('%%(%x%x)', hex2char)
end

query = os.getenv("QUERY_STRING")
if (query == nil or query == '') then
    os.exit()
end

print("Content-Type: application/json; charset=utf-8\n")

k = query:sub(1, query:find("=")-1)
v = urldecode(query:sub(query:find("=")+1))

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
    sql = "SELECT value FROM status WHERE thing=\"currentplayer\";"
    cur = db:execute(sql)
    player = cur:fetch()
    sql = "SELECT value FROM status WHERE thing=\"currentavg\";"
    cur = db:execute(sql)
    avg = cur:fetch()
    sql = string.format("INSERT INTO leaders VALUES(\"%s\", \"%s\");", player, avg)
    db:execute(sql)
    sql = "DELETE FROM status WHERE thing=\"currentplayer\";"
    db:execute(sql)
    sql = "DELETE FROM rate;"
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
