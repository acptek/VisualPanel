from tornado import web, ioloop, httpserver
from handlers import BaseHandler
import tornado
import json
from models import user_mod, log_mod
from lib import alg_list


class IndexHandler(BaseHandler.BaseHandler):
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        # username = self.get_argument('user')
        username = tornado.escape.json_decode(self.current_user)
        usermod = user_mod.UserModel()
        userinfo = usermod.find_user(username)

        # print(userinfo)

        haveseen = []
        if userinfo['haveseen'] != None:
            haveseen = userinfo['haveseen'].split(' ')

        haventseen = []
        for i in range(1, len(alg_list.alg)+1):
            if str(i) not in haveseen:
                haventseen.append(i)

        logmod = log_mod.LogModel()
        userloginfo = logmod.find_log_from_userid(userinfo['id'])

        # print(userinfo['id'], 'userloginfo', userloginfo)

        self.render(
            'index.html',
            userinfo=userinfo,
            alglist=alg_list.alg,
            haveseen=haveseen,
            haventseen=haventseen,
            userloginfo=userloginfo,
        )
