from lib import db
from handlers.public import alg


class UserModel(db.DbConnection):

    def create_alg(self, ):
        try:
            self.connect()
            sql = ''  # 查询的sql语句
            self.cursor.execute(sql)
            return self.cursor.fetchone()
        except Exception as e:
            print(e)
            self.conn.rollback()
        finally:
            self.close()

    def delete_alg(self, usr):
        pass
