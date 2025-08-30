import asyncio
from dataclasses import dataclass
import inspect
import signal
import sys
import threading
import time
import traceback
from fastapi import FastAPI
import nest_asyncio
import logging
from slixmpp import ClientXMPP
import ssl
import json
from bson import ObjectId
import requests as r
import secrets
import requests
import io
import aiohttp

import random
import string
from dotenv import load_dotenv
import os
from pymongo import MongoClient

from fastapi.middleware.cors import CORSMiddleware

import zlib
import base64

import uvicorn
import hashlib

import base64
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

mainloop = None


def generate_random_file_name(original_name):
    """
    Generates a random filename with the same extension.
    :param original_name: The original file name
    :return: The new hashed file name
    """
    extension = os.path.splitext(original_name)[1]
    hash_value = secrets.token_hex(12)  # 24-character hex string
    return f"{hash_value}{extension}"


def encrypt(text: str, password: str) -> str:
    key = hashlib.sha256(password.encode()).digest()
    iv = os.urandom(12)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(iv, text.encode(), None)
    auth_tag = ciphertext[-16:]
    cipher_data = ciphertext[:-16]

    return "{}:{}:{}".format(
        base64.b64encode(iv).decode(),
        base64.b64encode(cipher_data).decode(),
        base64.b64encode(auth_tag).decode(),
    )


def decrypt(encrypted_b64: str, password: str) -> str:
    iv_b64, ciphertext_b64, tag_b64 = encrypted_b64.split(":")
    key = hashlib.sha256(password.encode()).digest()

    iv = base64.b64decode(iv_b64)
    ciphertext = base64.b64decode(ciphertext_b64)
    tag = base64.b64decode(tag_b64)

    aesgcm = AESGCM(key)
    data = ciphertext + tag
    return aesgcm.decrypt(iv, data, None).decode()


def deflate_to_base64(input_string):
    """
    Compress (deflate) a string and return it as a Base64-encoded string.

    :param input_string: The string to compress.
    :return: The Base64-encoded compressed string.
    """
    try:
        # Step 1: Convert the input string to bytes
        input_data = input_string.encode("utf-8")

        # Step 2: Compress the data using zlib
        compressed_data = zlib.compress(input_data)

        # Step 3: Encode the compressed data as a Base64 string
        base64_string = base64.b64encode(compressed_data).decode("utf-8")

        return base64_string
    except Exception as e:
        print(f"Failed to deflate data: {e}")
        raise


def inflate_from_base64(base64_string):
    """
    Inflate (decompress) a Base64-encoded string using zlib.

    :param base64_string: The Base64-encoded compressed string.
    :return: The decompressed string.
    """
    try:
        # Step 1: Decode the Base64 string into bytes
        compressed_data = base64.b64decode(base64_string)

        # Step 2: Decompress the data using zlib
        decompressed_data = zlib.decompress(compressed_data)

        # Step 3: Convert the decompressed bytes to a string
        return decompressed_data.decode("utf-8")
    except Exception as e:
        print(f"Failed to inflate data: {e}")
        raise


def get_files_in_directory(dir_path):
    file_paths = []
    try:
        for entry in os.listdir(dir_path):
            full_path = os.path.join(dir_path, entry)
            if os.path.isfile(full_path):
                file_paths.append(full_path)
        return file_paths
    except Exception as e:
        print(f"Error reading directory {dir_path}: {e}")
        return []


nest_asyncio.apply()

# logging.basicConfig(level=logging.DEBUG)


@dataclass
class APISpecs:
    cmd: str
    uid: str
    role: str
    app: str
    resource: str
    servid: ObjectId
    servsecret: str
    body: dict


@dataclass
class MessageSpecs:
    fromjid: str
    body: str | dict
    role: str
    channel: str
    app: str
    uid: str
    resource: str
    itsme: bool
    itsbro: bool


class SetInterval:
    def __init__(self, callback, interval_ms):
        self.callback = callback
        self.interval = interval_ms / 1000  # convert ms to seconds
        self._task = None
        self._stopped = False

    async def _run(self):
        while not self._stopped:
            await asyncio.sleep(self.interval)
            try:
                if inspect.iscoroutinefunction(self.callback):
                    await self.callback()
                else:
                    self.callback()
            except Exception as e:
                print(f"[SetInterval Error] {e}")

    def start(self):
        loop = asyncio.get_event_loop()
        self._task = loop.create_task(self._run())

    def stop(self):
        self._stopped = True
        if self._task:
            self._task.cancel()


class SetTimeout:
    def __init__(self, callback, timeout_ms):
        self.callback = callback
        self.timeout = timeout_ms / 1000  # convert ms to seconds
        self._task = None

    async def _run(self):
        try:
            await asyncio.sleep(self.timeout)
            if inspect.iscoroutinefunction(self.callback):
                await self.callback()
            else:
                self.callback()
        except Exception as e:
            print(f"[SetTimeout Error] {e}")

    def start(self):
        loop = asyncio.get_event_loop()
        self._task = loop.create_task(self._run())

    def cancel(self):
        if self._task:
            self._task.cancel()


class SetIntervalSafe:
    def __init__(self, callback, interval_ms):
        self.callback = callback
        self.interval = interval_ms / 1000  # convert ms to seconds
        self._task = None
        self._stopped = False

    async def _run(self):
        while not self._stopped:
            await asyncio.sleep(self.interval)
            try:
                if inspect.iscoroutinefunction(self.callback):
                    mainloop.call_soon_threadsafe(
                        lambda: asyncio.create_task(self.callback())
                    )
                else:
                    mainloop.call_soon_threadsafe(self.callback)
            except Exception as e:
                print(f"[SetInterval Error] {e}")

    def start(self):
        loop = asyncio.get_event_loop()
        self._task = loop.create_task(self._run())

    def stop(self):
        self._stopped = True
        if self._task:
            self._task.cancel()


class SetTimeoutSafe:
    def __init__(self, callback, timeout_ms):
        self.callback = callback
        self.timeout = timeout_ms / 1000  # convert ms to seconds
        self._task = None

    async def _run(self):
        try:
            await asyncio.sleep(self.timeout)
            if inspect.iscoroutinefunction(self.callback):
                # print("CALLED")
                mainloop.call_soon_threadsafe(
                    lambda: asyncio.create_task(self.callback())
                )
            else:
                mainloop.call_soon_threadsafe(self.callback)
        except Exception as e:
            print(f"[SetTimeout Error] {e}")

    def start(self):
        loop = asyncio.get_event_loop()
        self._task = loop.create_task(self._run())

    def cancel(self):
        if self._task:
            self._task.cancel()


def serial_generator(length: int) -> str:
    chars = string.digits + string.ascii_uppercase + string.ascii_lowercase
    random_string = "".join(random.choice(chars) for _ in range(length))
    return random_string


eventsx = {}


def MD5(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def SHA256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


class WSX(ClientXMPP):
    connected = False
    users = {}
    nicknameToJidMap = {}
    eventdatax = {}

    msgreceiver = None

    def __init__(self, jid, password, app: str, uid: str, resource: str):

        appname = os.path.basename(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../")))
        workername = os.path.basename(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../")))
        
        if "-" in app:
            raise "app should not contain dash '-'"
        if "-" in resource:
            raise "resource should not contain dash '-'"

        ClientXMPP.__init__(self, jid, password)
        self.app = app
        self.uid = uid
        self._resource = f"{workername}.{appname}.dev"
        
        if os.getenv("RESOURCE"):
            self._resource = os.getenv("RESOURCE")
        self.password = password

        self.add_event_handler(
            "message",
            lambda stanza: mainloop.call_soon_threadsafe(
                lambda: asyncio.create_task(self.on_message(stanza))
            ),
        )
        # self.add_event_handler("session_start", lambda stanza: mainloop.call_soon_threadsafe(lambda: asyncio.create_task(self.start(stanza))))
        # self.add_event_handler("failed_auth", lambda stanza: mainloop.call_soon_threadsafe(lambda: asyncio.create_task(self.on_failed_auth(stanza))))
        # self.add_event_handler("disconnected", lambda stanza: mainloop.call_soon_threadsafe(lambda: asyncio.create_task(self.on_disconnect(stanza))))
        # self.add_event_handler("presence", lambda stanza: mainloop.call_soon_threadsafe(lambda: asyncio.create_task(self.handle_presence(stanza))))

        self.add_event_handler("failed_auth", self.on_failed_auth)
        self.add_event_handler("session_start", self.start)
        self.add_event_handler("disconnected", self.on_disconnect)
        # self.add_event_handler("message", self.on_message)
        self.add_event_handler("presence", self.handle_presence)

    async def start(self, event):
        """Handle session start."""
        self.send_presence(ptype="presence")
        await self.get_roster()
        # await self.emit("__connect",{})
        print(f"[nexus-{self._resource}] connected.")
        self.connected = True

    async def handle_presence(self, presence):
        from_jid = presence["from"]
        x = presence.xml.find("{http://jabber.org/protocol/muc#user}x")
        if x is not None:
            item = x.find("{http://jabber.org/protocol/muc#user}item")
            if item is not None and "jid" in item.attrib:
                self.nicknameToJidMap[str(from_jid)] = item.attrib["jid"]

    async def on_failed_auth(self, event):
        """Handle authentication failure."""

    async def on_disconnect(self, event):
        """Handle disconnection and attempt reconnection."""
        # await self.emit("__disconnect",{})
        # print(f"[nexus-{self.resource}] disconnected.")
        self.connected = False
        asyncio.create_task(self.reconnect())

    async def reconnect(self):
        await asyncio.sleep(5)
        self.connect(
            address=("qepal.com", 5222),
            disable_starttls=False,
            force_starttls=True,
        )
        self.process(forever=False)

    async def on_message(self, stanza):
        """Handle incoming messages."""
        if stanza.tag == "{jabber:client}message":
            body = str(stanza["body"])
            try:
                body = inflate_from_base64(body)
            except:
                pass
            from_jid = str(stanza["from"])
            itsme = (
                from_jid
                and f"{self.boundjid.bare.split('@')[0]}-{self.boundjid.bare.split('@')[1]}"
                in from_jid
            )
            itsbro = not itsme and f"{self.boundjid.bare.split('@')[0]}-" in from_jid

            if "conference.qepal.com" in from_jid:
                itsme = f"{self.app}-{self.uid}-{self._resource}" in from_jid
                itsbro = not itsme and f"{self.app}-{self.uid}-" in from_jid

            delayed = "urn:xmpp:delay" in str(stanza)

            if body and not delayed:

                itsbro = False
                itsme = False

                if body.startswith("{"):
                    try:
                        json_data = json.loads(body)
                        if (
                            "api" in json_data
                            and "@conference.qepal.com" not in from_jid
                        ):

                            data = {
                                k: v
                                for k, v in json_data.items()
                                if k not in ["api", "mid"]
                            }
                            uid = None
                            resource = None
                            head = from_jid.split("@qepal.com/")
                            heads = head[0].split("-")
                            app = heads[0]
                            ___useruid = heads[1]
                            role = heads[2]
                            resource = head[1]
                            if len(___useruid) == 24 and ObjectId.is_valid(___useruid):
                                uid = ___useruid

                            res = {"code": -500, "msg": "not implemented."}
                            servid = None
                            servsecret = None

                            if self.users.get(uid) == None and os.getenv(
                                "EXPLORE_SECRET"
                            ):

                                json_resp = (
                                    r.post(
                                        "https://qepal.com/api/service/hasaliveservice",
                                        json={
                                            "exploresecret": os.getenv(
                                                "EXPLORE_SECRET"
                                            ),
                                            "uid": uid,
                                        },
                                    )
                                ).json()

                                if json_resp["code"] != 0:
                                    if app != self.app or (
                                        role not in ["partner", "owner"]
                                    ):
                                        res = {
                                            "code": -3000,
                                            "msg": "you don't have active service.",
                                        }
                                else:
                                    servid = json_resp.get("servid")
                                    servsecret = json_resp.get("secret")
                                    self.users[uid] = json_resp

                            elif self.users.get(uid) != None:
                                servid = self.users[uid].get("servid")
                                servsecret = self.users[uid].get("secret")

                            if res["code"] != -3000:
                                if json_data["api"] == "ping":
                                    return {"pong": True, "environment":"python"}
                                res = await self.onapi(
                                    APISpecs(
                                        **{
                                            "cmd": json_data["api"],
                                            "uid": uid,
                                            "role": role,
                                            "app": app,
                                            "resource": resource,
                                            "servid": servid,
                                            "servsecret": servsecret,
                                            "body": data,
                                        }
                                    )
                                )

                            if not res:
                                res = {}

                            self.send_message(
                                mto=from_jid,
                                mbody=deflate_to_base64(
                                    json.dumps({**res, "mid": json_data.get("mid")})
                                ),
                            )

                        elif (
                            "mid" in json_data and eventsx.get(json_data["mid"]) != None
                        ):
                            mid = json_data["mid"]
                            del json_data["mid"]
                            self.eventdatax[mid] = json_data
                            eventsx[mid].set()

                            return
                    except Exception as e:
                        print("Error message:", str(e))
                        print("Full traceback:")
                        traceback.print_exc()

                # Conference or general message handling
                channel = None
                uid = None
                _resource = None
                role = None
                app = None

                if "@conference.qepal.com" in from_jid:
                    channel = from_jid.split("@")[0]
                    real_jid = self.nicknameToJidMap.get(from_jid)
                    if real_jid:
                        from_jid = real_jid

                try:
                    ss = from_jid.split("@qepal.com/")
                    head = ss[0]
                    tail = ss[1]
                    heads = head.split("-")
                    app = heads[0]
                    uid = heads[1]
                    role = heads[2]
                    _resource = tail
                except Exception as e:
                    print("Error message:", str(e))
                    print("Full traceback:")
                    traceback.print_exc()

                if uid == str(self.uid):
                    itsbro = True
                    if self.resource == _resource:
                        itsme = True

                try:
                    if (
                        (len(heads) == 3 or len(heads) == 4)
                        and len(uid) == 24
                        and ObjectId.is_valid(uid)
                    ):
                        if self.msgreceiver:
                            try:
                                body = json.loads(body)
                                if (
                                    type(body) == dict
                                    and body.get("api")
                                    and body.get("mid")
                                ):
                                    return
                            except:
                                pass
                            await self.msgreceiver(
                                MessageSpecs(
                                    **{
                                        "fromjid": from_jid,
                                        "body": body,
                                        "role": role,
                                        "channel": channel,
                                        "app": app,
                                        "uid": uid,
                                        "resource": _resource,
                                        "itsme": itsme,
                                        "itsbro": itsbro,
                                    }
                                )
                            )
                except Exception as e:
                    print("Error message:", str(e))
                    print("Full traceback:")
                    traceback.print_exc()


class App:
    xmpp: WSX = None
    udb = None
    xdb = None
    rest_online = False
    jidhash = {}
    __udbclient: MongoClient = None
    thread: threading.Thread = None
    rest: FastAPI

    def encryptor(self, text, password):
        return encrypt(text, password)

    def decryptor(self, encrypted_b64, password):
        return decrypt(encrypted_b64, password)

    def run_rest(self):
        self.rest = FastAPI()

        self.rest.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # or specify exact domains: ["https://example.com"]
            allow_credentials=True,
            allow_methods=["*"],  # or ["GET", "POST", ...]
            allow_headers=["*"],  # or ["Authorization", "Content-Type", ...]
        )

        def run_server():
            if self.rest_online:
                uvicorn.run(self.rest, host="0.0.0.0", port=self.rest_online)

        thread = threading.Thread(target=run_server, daemon=True)
        thread.start()

    def __init__(
        self,
        *,
        image: str = "/files/app/robot.webp",
        public: bool,
        rest: bool | int = False,
    ):

        global mainloop
        mainloop = asyncio.get_event_loop()

        def ignore_exit_error(signal, frame):
            sys.exit(0)

        if rest == True:
            self.rest_online = 3000

        elif self.rest_online and os.getenv("PUBLISH"):
            self.rest_online = 3000
        else:
            self.rest_online = rest

        signal.signal(signal.SIGINT, ignore_exit_error)

        os.system("cls" if os.name == "nt" else "clear")
        # load_dotenv(".env.local")

        envs = get_files_in_directory("./envs")
        for p in envs:
            load_dotenv(dotenv_path=p)
        self.channels = set()
        
        appname = os.path.basename(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../")))
        workername = os.path.basename(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../")))
        
        self.resource = f"{workername}.{appname}.dev"

        if os.getenv("RESOURCE"):
            self.resource = os.getenv("RESOURCE")
            
        self.image = image
        self.public = public
        if "-" in self.resource:
            raise Exception("Error: resource name should not contain dash '-'.")

        self.secret = None

        explore_secret = None
        service_secret = None

        if os.getenv("EXPLORE_SECRET"):
            self.secret = os.getenv("EXPLORE_SECRET")
            explore_secret = self.secret

        service_secret = os.getenv(f"SERVICE_SECRET")
        if service_secret:
            self.secret = service_secret

        if not self.secret:
            raise Exception("No service or explore secret code found in envs.")

        if explore_secret:
            response = r.post(
                "https://qepal.com/api/explore/getmongourl",
                json={"secret": explore_secret},
            )
            json = response.json()

            if json.get("code") == 0 and json.get("mongourl"):
                mongourl = json["mongourl"]
                os.environ["UMONGOURL"] = mongourl
                os.environ["UMONGODB_DB"] = mongourl.split(":")[1].replace("//", "")

            mongourl = os.getenv("UMONGOURL")
            mongo_db = os.getenv("UMONGODB_DB")

            if mongourl:
                try:
                    client = MongoClient(mongourl)
                    client.server_info()
                    self.udb = client[mongo_db]
                    print()
                    print("udb-mongo connected.")
                except:
                    print()
                    print("udb-mongo not connected.")
            else:
                print("no udb is set on explore")

        if service_secret:
            response = r.post(
                "https://qepal.com/api/service/getmongourl",
                json={"secret": service_secret},
            )
            json = response.json()

            if json.get("code") == 0 and json.get("mongourl"):
                xmongourl = json["mongourl"]
                os.environ["XMONGOURL"] = xmongourl
                os.environ["XMONGODB_DB"] = xmongourl.split(":")[1].replace("//", "")

            xmongourl = os.getenv("XMONGOURL")
            xmongo_db = os.getenv("XMONGODB_DB")

            if xmongourl:
                try:
                    client = MongoClient(xmongourl)
                    client.server_info()
                    self.xdb = client[xmongo_db]
                    print()
                    print("xdb-mongo connected.")
                except:
                    print()
                    print("xdb-mongo not connected.")
            else:
                print("no xdb is set on service.")

        response = r.post(
            "https://qepal.com/api/bridge/worker/service",
            json={
                "secret": self.secret,
                "image": self.image,
                "public": self.public,
                "resource": self.resource,
            },
        )

        __json = response.json()

        if __json.get("code") != 0:
            raise Exception("ERROR: ****WRONG SECRETKEY IN ENVS****")

        self.app = __json["app"]
        self.xmrole = __json["role"]
        self.uid = ObjectId(__json["uid"])
        self.myjid = f"{__json['user']}@qepal.com/{self.resource}"

        self.password = __json["password"]
        # print(
        #     "trying JID:", self.myjid, self.password, self.app, self.uid, self.resource
        # )
        
        self.xmpp = WSX(self.myjid, self.password, self.app, self.uid, self.resource)

        def run_event_loop(loop_coroutine):
            asyncio.run(loop_coroutine)

        self.thread = threading.Thread(target=run_event_loop, args=(self.__loop(),))
        self.thread.daemon = True
        self.thread.start()

        # SetTimeout(self.__loop, 10).start()

        # print("PASS1")
        while True:
            if self.xmpp.connected:
                break
            time.sleep(0.1)

        # print("PASS2")
        # SetTimeout(self.run_rest, 10).start()
        self.run_rest()

    def on(self, api: str, cb: callable):
        self.xmpp.on(api, cb)

    def sendtojid(self, jid: str, body: str):
        self.xmpp.send_message(mto=jid, mbody=deflate_to_base64(body))

    def connected(self):
        return self.xmpp.connected

    async def api(
        self,
        *,
        app: str,
        cmd: str,
        body={},
        onlymine: bool = False,
        onlyowner: bool = False,
        resource: str = None,
        prioritize_mine: bool = False,
        jid: str = None,
    ):

        md5 = MD5(
            json.dumps(
                {
                    "app": app,
                    "onlymine": onlymine,
                    "onlyowner": onlyowner,
                    "resource": resource,
                    "jid": jid,
                    "prioritize_mine": prioritize_mine,
                }
            )
        )

        if jid == None:
            if self.jidhash.get(md5):
                jid = jidhash[md5]
            else:
                res: dict = r.post(
                    "https://qepal.com/api/bridge/worker/findfreeresource",
                    json={
                        "app": app,
                        "secret": self.secret,
                        "onlymine": onlymine,
                        "onlyowner": onlyowner,
                        "resource": resource,
                    },
                ).json()

                jids = list(res.get("jids", []))
                if len(jids) > 0:
                    if prioritize_mine:
                        jid = jids[0]
                    else:
                        jid = jids[-1]
        if jid == None:
            return {"error": "no worker found"}

        mid = serial_generator(10)
        msg = {"mid": mid, "api": cmd, **body}

        eventsx[mid] = asyncio.Event()
        self.sendtojid(jid, json.dumps(msg))
        SetTimeout(lambda: eventsx[mid].set(), 60000).start()
        await eventsx[mid].wait()
        data = self.xmpp.eventdatax.get(mid)
        if data == None:
            data = {"error": "timeout"}
        return data

    async def direct(
        self,
        *,
        app: str,
        body: str,
        onlymine: bool = False,
        onlyowner: bool = False,
        resource: str = None,
        prioritize_mine: bool = False,
        jid: str = None,
    ):

        md5 = MD5(
            json.dumps(
                {
                    "app": app,
                    "onlymine": onlymine,
                    "onlyowner": onlyowner,
                    "resource": resource,
                    "jid": jid,
                    "prioritize_mine": prioritize_mine,
                }
            )
        )

        if jid == None:
            if self.jidhash.get(md5):
                jid = jidhash[md5]
            else:
                res: dict = r.post(
                    "https://qepal.com/api/bridge/worker/findfreeresource",
                    json={
                        "app": app,
                        "secret": self.secret,
                        "onlymine": onlymine,
                        "onlyowner": onlyowner,
                        "resource": resource,
                    },
                ).json()

                jids = list(res.get("jids", []))
                if len(jids) > 0:
                    if prioritize_mine:
                        jid = jids[0]
                    else:
                        jid = jids[-1]
        if jid == None:
            return {"error": "no worker found"}

        self.sendtojid(jid, body)

    def subscribe(self, channelname: str):
        self.xmpp.send_presence(
            pto=channelname
            + "@conference.qepal.com/"
            + self.app
            + "-"
            + str(self.uid)
            + "-"
            + self.resource,
            ptype="available",
        )
        self.xmpp.get_roster()
        self.channels.add(channelname)

    def unsubscribe(self, channelname: str):
        self.xmpp.send_presence(
            pto=channelname + "@conference.qepal.com", ptype="unavailable"
        )
        self.xmpp.get_roster()
        self.channels.remove(channelname)

    def sendtochannel(self, channelname: str, body: str):
        if channelname not in self.channels:
            self.subscribe(channelname)

        # self.subscribe(channelname)
        self.xmpp.get_roster()
        self.xmpp.send_message(
            mto=f"{channelname}@conference.qepal.com",
            mbody=deflate_to_base64(body),
            mtype="groupchat",
        )

    async def proxy(self, *, url: str, bodytype: str, body=None, headers=None):
        headers = headers or {}

        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://irmapserver.ir/api.php",
                json={"url": url, "body": body, "headers": headers},
            ) as resp:
                data = await resp.json()

        decoded_body = base64.b64decode(data["body"])

        if bodytype == "binary":
            return {
                "body": decoded_body,
                "responseHeaders": data.get("responseHeaders", {}),
            }
        elif bodytype == "string":
            return {
                "body": decoded_body.decode("utf-8"),
                "responseHeaders": data.get("responseHeaders", {}),
            }
        elif bodytype == "json":
            return {
                "body": json.loads(decoded_body.decode("utf-8")),
                "responseHeaders": data.get("responseHeaders", {}),
            }
        else:
            raise ValueError(f"Unknown bodytype: {bodytype}")

    async def downloader(self, url: str, proxy: bool = False):
        if proxy:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://irmapserver.ir/api.php", json={"url": url, "headers": {}}
                ) as resp:
                    data = await resp.json()
            return base64.b64decode(data["body"])
        else:
            try:
                # Synchronous request using requests
                response = requests.get(url)
                response.raise_for_status()
                data_buffer = response.content
                print(f"Downloaded {len(data_buffer)} bytes")
                return data_buffer
            except Exception as e:
                print(f"Error downloading from URL: {url} - {e}")
                raise

    def uploader(self, content, max_age_sec, extension=None, on_progress=None):
        """
        Uploads a string or bytes as a virtual file.

        :param content: The content to upload (str or bytes)
        :param max_age_sec: Expiry time for the file in seconds
        :param extension: Optional file extension (e.g. ".txt")
        :param on_progress: Optional progress callback function (int percent)
        :return: URL of the uploaded file if successful, else None
        """

        if not self.uid:
            raise Exception("UID Not found!")

        if extension and not extension.startswith("."):
            extension = "." + extension

        server_url = "https://cdn.ituring.ir/qeupload/uploader.php"
        new_file_name = generate_random_file_name(f"file{extension or '.dat'}")

        if isinstance(content, str):
            content = content.encode("utf-8")

        buffer_stream = io.BytesIO(content)

        def create_progress_hook(file_size):
            def hook(monitor):
                if on_progress:
                    percent = int((monitor.bytes_read / file_size) * 100)
                    on_progress(min(100, percent))

            return hook

        file_size = len(content)
        from requests_toolbelt import MultipartEncoder, MultipartEncoderMonitor

        fields = {
            "uid": str(self.uid),
            "max_age_sec": str(max_age_sec),
            "submit": "1",
            "filesToUpload[]": (
                new_file_name,
                buffer_stream,
                "application/octet-stream",
            ),
        }

        encoder = MultipartEncoder(fields=fields)
        monitor = MultipartEncoderMonitor(encoder, create_progress_hook(file_size))

        try:
            response = requests.post(
                server_url, data=monitor, headers={"Content-Type": monitor.content_type}
            )
            response.raise_for_status()

            return f"https://cdn.ituring.ir/qeupload/{self.uid}/{new_file_name}"

        except requests.exceptions.RequestException as e:
            print(f"Upload failed for Buffer: {e}")
            if self.wsdebug and e.response is not None:
                print("Response from server:", e.response.text)
            elif self.wsdebug:
                print("Error message:", str(e))
            return None

    async def __loop(self):

        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        self.xmpp.ssl_context = ssl_ctx

        self.xmpp.connect(
            address=("qepal.com", 5222),
            disable_starttls=False,
            force_starttls=True,
        )

        try:
            self.xmpp.process(forever=True)
        except KeyboardInterrupt:
            print("Exiting the application...")
            sys.exit()
