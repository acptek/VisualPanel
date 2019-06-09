from tornado import web, ioloop, httpserver
from handlers import BaseHandler
from models import user_mod, log_mod
from lib import alg_list
import tornado


class ManageLogHandler(BaseHandler.BaseHandler):
    @tornado.web.authenticated
    def get(self):

        username = tornado.escape.json_decode(self.current_user)
        usermod = user_mod.UserModel()
        userinfo = usermod.find_user(username)
        logmod = log_mod.LogModel()
        userloginfo = logmod.find_log_from_userid(userinfo['id'])
        self.render(
            'logs_manager.html',
            username=username,
            userloginfo=userloginfo,
            alg_list=alg_list.alg,
        )

    def post(self):
        delid = self.get_argument('delid')[3:]
        logmod = log_mod.LogModel()
        aftid = logmod.delete_log(delid)
        print('delid:',delid)
        self.write(str(aftid))

