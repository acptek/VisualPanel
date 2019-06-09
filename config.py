import pymysql.cursors

PY_MYSQL_DICT = {
    'host': 'localhost',
    'user': 'root',
    'password': 'a',
    'port': 3306,
    'database': 'algviz',
    'charset': 'utf8',
    'cursorclass': pymysql.cursors.DictCursor,
}
