#!/usr/bin/lua
cookie = os.getenv("HTTP_COOKIE")
if cookie == nil then
    urandom = assert(io.open('/dev/urandom','rb'))
    fuck, all, this, bullshit = urandom:read(4):byte(1,4)
    urandom:close()
    rand = ((fuck * 256 * 256 * 256) + (all * 256 * 256) + (this * 256) + bullshit)
    print(string.format("Set-Cookie: id=%s; Expires=Date: Fri, 1 Sept 2017 00:00:00 GMT;\n", rand))
    cookie = string.format("id=%s", rand)
end

query = os.getenv("QUERY_STRING")
if (query == nil or query == '') then
    os.exit()
end

q = query:sub(query:find("=")+1)
i = cookie:sub(cookie:find("=")+1)

--input validation... ish?
if tonumber(i) < 1 then
    os.exit()
end
if tonumber(q) < 1 or tonumber(q) > 5 then
    os.exit()
end

drv = assert(require "luasql.sqlite3")
dbenv = assert(drv.sqlite3())
db = assert(dbenv:connect("../🔥.db"))
sql = string.format("DELETE FROM rate WHERE id=%s;", i)
db:execute(sql)
sql = string.format("INSERT INTO rate VALUES(%s, %s);", i, q)
db:execute(sql)
db:close()
dbenv:close()

print("Content-Type: text/plain; charset=utf-8\n")
