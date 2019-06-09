from lib import db
from handlers.public import log
import datetime ,time


class LogModel(db.DbConnection):

    def create_log(self, userid, algid, logtitle, logcontent):

        try:
            self.connect()
            dt = datetime.datetime.now()
            dt_now = dt.strftime('%Y-%m-%d %H:%M:%S')
            sql1 = 'SET FOREIGN_KEY_CHECKS = 0'
            sql2 = 'insert into log(content, time, algid, userid, title) values (%s, %s, %s, %s, %s)'
            sql3 = 'SET FOREIGN_KEY_CHECKS = 1'
            self.cursor.execute(sql1)
            self.cursor.execute(sql2, (logcontent, dt_now, algid, userid, logtitle))
            self.cursor.execute(sql3)
            self.close()
            return self.cursor.lastrowid
        except Exception as e:
            print('Create Log Failed')
            print(e)

    def delete_log(self, logid):
        try:
            self.connect()
            sql1 = 'SET FOREIGN_KEY_CHECKS = 0'
            sql2 = 'delete from log where id = %s'
            sql3 = 'SET FOREIGN_KEY_CHECKS = 1'
            self.cursor.execute(sql1)
            self.cursor.execute(sql2, logid)
            self.cursor.execute(sql3)
            self.close()
            return self.cursor.lastrowid
        except Exception as e:
            print('Delete Log Failed !')
            print(e)

    def find_log(self, logid):
        try:
            self.conn()
            sql = 'select * from log where id = %d'
            self.cursor.execute(sql, (logid))
            self.close()
            return self.cursor.fetchone()
        except Exception as e:
            print('Find Log Failed !')
            print(e)

    def update_log(self, logid, content):
        try:
            self.connect()
            sql1 = 'SET FOREIGN_KEY_CHECKS = 0'
            sql2 = 'update log set content = %s where id = %s'
            sql3 = 'SET FOREIGN_KEY_CHECKS = 1'
            self.cursor.execute(sql1)
            self.cursor.execute(sql2, (content, logid))
            self.cursor.execute(sql3)
            self.close()
            return self.cursor.lastrowid
        except Exception as e:
            print('Update Log Failed !')
            print(e)

    def find_log_from_userid(self, userid):
        try:
            self.connect()
            sql = 'select * from log where userid = %s order by time desc'
            self.cursor.execute(sql, userid)
            self.close()
            return self.cursor.fetchall()
        except Exception as e:
            print('Find Log From UserId Failed !')
            print(e)

    def find_log_by_id(self, id):
        try:
            self.connect()
            sql = 'select * from log where id = %s'
            self.cursor.execute(sql, id)
            self.close()
            return self.cursor.fetchone()
        except Exception as e:
            print('Find Log From Id Failed !')
            print(e)