from tornado import web, ioloop, httpserver
from handlers import BaseHandler
from models import user_mod, log_mod
from lib import alg_list
import tornado


class CreateLogHandler(BaseHandler.BaseHandler):
    @tornado.web.authenticated
    def get(self):
        username = tornado.escape.json_decode(self.current_user)
        self.render(
            'logs_creator.html',
            alglist=alg_list.alg,
            username=username,
        )

    def post(self):
        logtitle = self.get_argument('title')
        logcontent = self.get_argument('content')
        logalgid = self.get_argument('algid')
        username = tornado.escape.json_decode(self.current_user)
        print('-->', username)
        usermod = user_mod.UserModel()
        userinfo = usermod.find_user(username)
        userid = userinfo['id']
        print('userid : ', userid)

        logmod = log_mod.LogModel()
        logcreate = logmod.create_log(userid, logalgid, logtitle, logcontent)
        print(logcreate)
