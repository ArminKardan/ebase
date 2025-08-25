import asyncio
import sys
import threading
import time
from libs.bridge import APISpecs, App as app, MessageSpecs, SetInterval
import json
from libs.startup import startup
startup()



App = app(resource="python", image="/files/app/robot.webp", public=True)

@App.rest.get("/")
def root():
    return {"message": "this is rest api"}


@App.rest.get("/items/{item_id}")
def item(item_id: int):
    return {"item_id": item_id}


async def api(specs: APISpecs):
    if specs.cmd == "ping":
        return {"pong": True}


async def msgreceiver(specs: MessageSpecs):
    print("MSG:", specs)

App.xmpp.onapi = api
App.xmpp.msgreceiver = msgreceiver
loop = asyncio.get_event_loop()
loop.run_forever()
