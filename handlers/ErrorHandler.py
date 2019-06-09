from tornado import web, ioloop, httpserver
from handlers import BaseHandler
from models import user_mod
import tornado


class ErrorHandler(BaseHandler):

    def get(self):
        self.render('error.html')
