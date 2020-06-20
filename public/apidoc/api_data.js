define({ "api": [
  {
    "type": "delete",
    "url": "/api/user/del",
    "title": "删除",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>标识</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result",
            "description": ""
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "routes/api/user.js",
    "groupTitle": "user",
    "name": "DeleteApiUserDel"
  },
  {
    "type": "get",
    "url": "/api/user/list",
    "title": "",
    "group": "user",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result",
            "description": ""
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "routes/api/user.js",
    "groupTitle": "user",
    "name": "GetApiUserList"
  },
  {
    "type": "GET",
    "url": "/api/user/one",
    "title": "获取单个",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result",
            "description": ""
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "routes/api/user.js",
    "groupTitle": "user",
    "name": "GetApiUserOne"
  },
  {
    "type": "post",
    "url": "/api/user/edit",
    "title": "修改",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>标识</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "focus",
            "description": "<p>focus</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result",
            "description": ""
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "routes/api/user.js",
    "groupTitle": "user",
    "name": "PostApiUserEdit"
  },
  {
    "type": "post",
    "url": "/api/user/login",
    "title": "登录",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result",
            "description": ""
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "routes/api/user.js",
    "groupTitle": "user",
    "name": "PostApiUserLogin"
  },
  {
    "type": "post",
    "url": "/api/user/register",
    "title": "新增",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>姓名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result",
            "description": ""
          }
        ]
      }
    },
    "version": "1.0.0",
    "filename": "routes/api/user.js",
    "groupTitle": "user",
    "name": "PostApiUserRegister"
  }
] });
