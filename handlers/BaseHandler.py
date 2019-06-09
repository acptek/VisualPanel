from tornado import web, ioloop, httpserver
import tornado


class BaseHandler(tornado.web.RequestHandler):

    def get_current_user(self):
        return self.get_secure_cookie('user')
