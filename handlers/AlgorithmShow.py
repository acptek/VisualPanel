from tornado import web, ioloop, httpserver
from handlers import BaseHandler
from models import user_mod, log_mod
from lib import alg_list
import tornado


class AlgShowHandler(BaseHandler.BaseHandler):
    @tornado.web.authenticated
    def get(self):
        username = tornado.escape.json_decode(self.current_user)
        usermod = user_mod.UserModel()
        userinfo = usermod.find_user(username)
        curid = self.get_argument('algid')

        strh = str(userinfo['haveseen'])
        print(strh)
        if strh == 'None':
            strh = curid
        else:
            haveseen = userinfo['haveseen'].split(' ')
            if curid not in haveseen:
                strh += ' ' + curid

        usermod.update_user_haveseen(userinfo['id'], strh)
        usermod.update_user_lastseen(userinfo['id'], curid)
        self.render(
            'algorithm.html',
            alg_list=alg_list.alg,
            username=username,
            curid=curid,
        )
