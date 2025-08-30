import asyncio
import sys
import threading
import time
import os

libs_path = os.path.join(os.path.dirname(__file__))
if libs_path not in sys.path:
    sys.path.insert(0, libs_path)

from libs.bridge import APISpecs, App as app, MessageSpecs, SetInterval
import json


App = app(public=True)



# @App.rest.get("/")
# def root():
#     return {"message": "this is rest api"}


# @App.rest.get("/items/{item_id}")
# def item(item_id: int):
#     return {"item_id": item_id}


async def api(specs: APISpecs):
    if specs.cmd == "test":
        return {"code": 0}


# async def msgreceiver(specs: MessageSpecs):
#     print("MSG:", specs)


App.xmpp.onapi = api
# App.xmpp.msgreceiver = msgreceiver
loop = asyncio.get_event_loop()
loop.run_forever()
