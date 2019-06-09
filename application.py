# coding=utf-8
from handlers import BaseHandler, IndexHandler, SignInHandler, LoginHandler, LogCreator, LogManager, LogShow, AlgorithmShow
from tornado import web, ioloop, httpserver
import uuid
import base64
import handlers
import tornado
import time
import tornado.web
import os

# path
settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
    static_path=os.path.join(os.path.dirname(__file__), "static"),
    cookie_secret=base64.b64encode(uuid.uuid4().bytes + uuid.uuid4().bytes),
    login_url='/login'
)

application = web.Application([
    (r'/login', LoginHandler.LoginHandler),
    (r'/register', SignInHandler.SignInHandler),
    (r'/index', IndexHandler.IndexHandler),
    (r'/log_creator', LogCreator.CreateLogHandler),
    (r'/log_manager', LogManager.ManageLogHandler),
    (r'/log_content', LogShow.ShowLogHandler),
    (r'/alg_show', AlgorithmShow.AlgShowHandler),
], **settings)

