import asyncio
from libs.bridge import NexusAPISpecs, App as AppClass, NexusMessageSpecs
from libs.bridge import setInterval, clearInterval, setTimeout


App = AppClass(public=True, rest=False)

counter = 0
@setInterval(500, "c")
def f():
    global counter
    counter += 1
    print("hi", counter)
    if counter > 5:
        clearInterval("c")


@setTimeout(5000)
def f():
    print("timedout 1")
    @setInterval(1000)
    def f():
        print("intervaling...")
        App.sendtochannel("mychannel", ["hello"])


@setTimeout(1000)
async def f():
    print("timedout 2")
    res = await App.api(app="eagents", cmd="ping", resource="wagents.ex")
    print(res)


@App.nexus.API("ping")
async def f(specs: NexusAPISpecs):
    return {"code": 0, "ponger": True}


@App.nexus.Direct()
async def f(specs: NexusMessageSpecs):
    print("Direct:", specs.body)
    return {"code": 0, "direct": True}


App.subscribe("mychannel")
@App.nexus.Channel("mychannel")
async def f(specs: NexusMessageSpecs):
    print("Channel:", specs.channel, specs.body)
    return {"code": 0, "ponger": True}


@App.nexus.MsgReceiver()
async def f(specs: NexusMessageSpecs):
    print("Message:", specs)
    return {"code": 0, "ponger": True}


@App.rest.get("/items/{item_id}")
def f(item_id: int):
    return {"item_id": item_id}


@App.rest.get("/")
def f():
    return {"message": "this is rest api"}


loop = asyncio.get_event_loop()
loop.run_forever()
