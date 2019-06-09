from tornado import web, ioloop, httpserver
from handlers import BaseHandler
from models import user_mod, log_mod
from lib import alg_list
import tornado


class ShowLogHandler(BaseHandler.BaseHandler):
    @tornado.web.authenticated
    def get(self):
        # url : contain log id
        logid = self.get_argument('logid')
        username = tornado.escape.json_decode(self.current_user)
        logmod = log_mod.LogModel()
        loginfo = logmod.find_log_by_id(logid)
        self.render(
            'logs_content.html',
            username=username,
            alg_list=alg_list.alg,
            loginfo=loginfo,
        )

    def post(self):
        logid = self.get_argument('logid')
        content = self.get_argument('content')
        logmod = log_mod.LogModel()
        loginfo = logmod.update_log(logid, content)
        self.write("Failed !")
