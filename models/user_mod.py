from lib import db
from handlers.public import user


class UserModel(db.DbConnection):

    def create_user(self, username, password):

        try:
            self.connect()
            sql = 'insert into user(name, pwd) values (%s,%s)'
            self.cursor.execute(sql, (username, password))
            self.close()
            return self.cursor.lastrowid
        except Exception as e:
            print('create user failed !')
            print(e)

    def exist_user(self, username):
        try:
            self.connect()
            sql = 'select * from user where name = %s'
            self.cursor.execute(sql, username)
            self.close()
            info = self.cursor.fetchone()
            if info:
                return True
            else:
                return False
        except Exception as e:
            print('find failed !')
            print(e)

    def delete_user(self, usr):
        try:
            self.connect()
            sql = ''
            self.cursor.execute(sql)
            self.close()
            return self.cursor.lastrowid
        except Exception as e:
            print('Delete User Failed !')
            print(e)

    def find_user(self, username):
        try:
            self.connect()
            sql = 'select * from user where name = %s'
            self.cursor.execute(sql, (username,))
            self.close()
            return self.cursor.fetchone()
        except Exception as e:
            print('Find User Failed !')
            print(e)

    def update_user_haveseen(self, userid, str):
        try:
            self.connect()
            sql = 'update user set haveseen = %s where id = %s'
            self.cursor.execute(sql, (str, userid))
            self.close()
            return self.cursor.lastrowid
        except Exception as e:
            print('Update User HaveSeen Failed !')
            print(e)

    def update_user_lastseen(self, userid, str):
        try:
            self.connect()
            sql = 'update user set lastseen = %s where id = %s'
            self.cursor.execute(sql, (str, userid))
            self.close()
            return self.cursor.lastrowid
        except Exception as e:
            print('Update User LastSeen Failed !')
            print(e)

    def change_password(self, usr, pwd):
        pass
