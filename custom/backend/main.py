from typing import Optional
from flask import Flask, request, Request, escape
import socket
import re
import json
import rsa
import base64
import os


SOCKET_HOST = 'connector'
SOCKET_PORT = 8764

PLUGIN_CTRL_LIST_FILE = '/app/files/plugin.txt'
USER_LIST_FILE = '/app/files/user.txt'

PLUGIN_LIST_RE = re.compile(r'^\s*plugins:\s*(.+)\s*$')

app = Flask(__name__)


@app.route('/core/list', methods=['GET'])
def listPlugins():
    try:
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.settimeout(0.5)
        client.connect((SOCKET_HOST, SOCKET_PORT))
        client.send('listPlugins')
        result = client.recv(4096).decode()
        client.close()
        list_result = PLUGIN_LIST_RE.match(result)
        if list_result is None:
            return {'code': -1}
        group1 = list_result.group(1)
        parsed = json.loads(group1)
        return {'code': 0, 'data': parsed}
    except:
        return {'code': -1}


@app.route('/core/list-loaded', methods=['GET'])
def listLoaded():
    try:
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.settimeout(0.5)
        client.connect((SOCKET_HOST, SOCKET_PORT))
        client.send('listLoadedPlugins')
        result = client.recv(4096).decode()
        client.close()
        list_result = PLUGIN_LIST_RE.match(result)
        if list_result is None:
            return {'code': -1}
        group1 = list_result.group(1)
        parsed = json.loads(group1)
        return {'code': 0, 'data': parsed}
    except:
        return {'code': -1}


@app.route('/core/list-has-ctrl', methods=['GET'])
def listHasCtrl():
    try:
        f = open(PLUGIN_CTRL_LIST_FILE)
        hasCtrl = f.readlines()
        f.close()
        return {'code': 0, 'data': hasCtrl}
    except:
        return {'code': -1}


def checkKey(data: bytes, sign: bytes, pub_key: rsa.PublicKey) -> bool:
    try:
        rsa.verify(data, sign, pub_key)
        return True
    except:
        return False


def checkUser(data: str, sign: str) -> Optional[rsa.PublicKey]:
    try:
        data_encoded = data.encode('utf-8')
        sign_encoded = base64.b64decode(sign)
        f = open(USER_LIST_FILE)
        users = f.readlines()
        f.close()
        for i in users:
            i_decoded = base64.b64decode(i)
            pub_key = rsa.PublicKey.load_pkcs1(i_decoded, 'DER')
            if checkKey(data_encoded, sign_encoded, pub_key):
                return pub_key
            return None
    except:
        return None


def checkRequest(req: Request) -> Optional[rsa.PublicKey]:
    if not req.is_json:
        return None
    data = req.json['data']
    sign = req.json['sign']
    if not isinstance(data, str) or not isinstance(sign, str):
        return None
    return checkUser(data, sign)


def encodeResponse(data: dict, key: rsa.PublicKey) -> str:
    data_str = json.dumps(data)
    encrypted = rsa.encrypt(data_str.encode('utf-8'), key)
    return base64.b64encode(encrypted)


@app.route('/core/new-user', methods=['POST'])
def newUser():
    try:
        user = checkRequest(request)
        if user is None:
            return {'code': -1}
        pub_key: rsa.PublicKey = None
        pri_key: rsa.PrivateKey = None
        pub_key, pri_key = rsa.newkeys()
        pub_key_code = pub_key.save_pkcs1('DER')
        pub_key_str = base64.b64decode(pub_key_code).decode('utf-8')
        pri_key_code = pri_key.save_pkcs1('DER')
        pri_key_str = base64.b64encode(pri_key_code).decode('utf-8')
        f = open(USER_LIST_FILE)
        users = f.readlines()
        f.close()
        users.append(pub_key_str)
        f = open(USER_LIST_FILE, 'w')
        f.writelines(users)
        f.close()
        pri_key_crypt = encodeResponse({'key': pri_key_str}, user)
        return {'code': 0, 'data': pri_key_crypt}
    except:
        return {'code': -1}


def decodeRequest(req: Request) -> Optional[dict]:
    data_str = req.json['data']
    data_dict = json.loads(data_str)
    if not isinstance(data_dict, dict):
        return None
    return data_dict


@app.route('/core/add-plugin', methods=['POST'])
def addPlugin():
    try:
        user = checkRequest(request)
        if user is None:
            return {'code': -1}
        req = decodeRequest(request)
        if req is None:
            return {'code': -1}
        name = req['name']
        if not isinstance(name, str):
            return {'code': -1}
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.settimeout(0.5)
        client.connect((SOCKET_HOST, SOCKET_PORT))
        client.send(f'addPlugin ${name}')
        client.close()
        return {'code': 0}
    except:
        return {'code': -1}


@app.route('/core/remove-plugin', methods=['POST'])
def removePlugin():
    try:
        user = checkRequest(request)
        if user is None:
            return {'code': -1}
        req = decodeRequest(request)
        if req is None:
            return {'code': -1}
        name = req['name']
        if not isinstance(name, str):
            return {'code': -1}
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.settimeout(0.5)
        client.connect((SOCKET_HOST, SOCKET_PORT))
        client.send(f'removePlugin ${name}')
        client.close()
        return {'code': 0}
    except:
        return {'code': -1}


@app.route('/plugin/<plugin_name>', methods=['POST'])
def toPlugin(plugin_name):
    try:
        user = checkRequest(request)
        if user is None:
            return {'code': -1}
        req = decodeRequest(request)
        if req is None:
            return {'code': -1}
        req_data = request.json['data']
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.settimeout(0.5)
        client.connect((SOCKET_HOST, SOCKET_PORT))
        client.send(f'toPlugin ${escape(plugin_name)} ${req_data}')
        result = client.recv(4096).decode()
        client.close()

        result_obj = json.loads(result)
        if not isinstance(result_obj, dict):
            return {'code': -1}
        return {'code': 0, 'data': encodeResponse(result_obj, user)}
    except:
        return {'code': -1}


if __name__ == '__main__':
    app.run()
