from tornado import web, ioloop, httpserver
from handlers import BaseHandler
from models import user_mod
import tornado


class LoginHandler(BaseHandler.BaseHandler):
    def get(self):
        self.render('login.html')

    def post(self, *args, **kwargs):
        username = self.get_argument('username')
        password = self.get_argument('password')
        usermod = user_mod.UserModel()
        userinfo = usermod.find_user(username)
        print('test', userinfo)

        if userinfo:
            if userinfo['pwd'] == password:
                print('correct')
                self.set_current_user(username)
                self.write('success')
            else:
                print('wrong')
                self.write('Password is Wrong !')
        else:
            print('none')
            self.write('No such user !')

    def set_current_user(self, user):
        if user:
            self.set_secure_cookie('user', tornado.escape.json_encode(user))
        else:
            self.clear_cookie('user')
