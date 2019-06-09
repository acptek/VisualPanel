from tornado import web, ioloop, httpserver
import tornado
from models import user_mod


class SignInHandler(web.RequestHandler):
    def get(self):
        self.render('signin.html')

    def post(self, *args, **kwargs):
        username = self.get_argument('username')
        password = self.get_argument('userpwd')
        cmfpwd = self.get_argument('cfmpwd')

        print(username, password, cmfpwd)

        usermod = user_mod.UserModel()
        isexist = usermod.exist_user(username)

        if isexist:
            self.write('This User is Exist !')
        else:
            if password != cmfpwd:
                self.write('Not Same')
            else:
                newuserid = usermod.create_user(username, password)
                print(newuserid, username, password)
                self.write('Register Success !')
