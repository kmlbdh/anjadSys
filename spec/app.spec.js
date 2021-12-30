var request = require("request");

// describe("connecting to Database", () => {
//   var dbConnection;
//   beforeAll(() => {
//     dbConnection = require("../config/config.db").connect();
//   });
//   it("indicate the connection is established", () => {
//     expect(dbConnection).not.toBeNull();
//   });
// });

describe("Server", () => {
  var server;
  beforeAll(() => {
    server = require("../index");
  });
  afterAll(() => {
    server.close();
  });

  //test login API
  describe("POST /api/login", () => {
    var data = {};
    postData = {
      username:'AD-001',
      password:'12345'
  };
    beforeAll((done) => {
      request.post({url: "http://localhost:3033/api/login", form:postData}, (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it("Status 200", () => {
      expect(data.status).toBe(200);
    });
    it("Body", () => {
      expect(data.body.id).toBe("AD-001");
      expect(data.body.username).toBe("obada");
      expect(data.body.nickname).toBe("newUser");
      expect(data.body.role).toBe("admin");
      expect(data.body.accessToken).toBeDefined();
    });

  });
  
  //test create agent from admin crear-user API
  describe("POST /api/admin/create-user", () => {
    var returnedloginData = {},
    data = {},
    postData = {
      username:'AD-001',
      password:'12345'
    },
    userData =   {
      "username": "hala",
      "nickname": "halaUser",
      "password": "12345",
      "confirmPassword": "12345",
      "phone": "2228220",
      "tel": "0569137015",
      "role": "agent"
    };
    beforeAll((done) => {
      request.post({url: "http://localhost:3033/api/login", form:postData}, (error, response, body) => {
        returnedloginData = JSON.parse(body);
        done();
      });
    });
    beforeAll((done) => {
      let headers = {
        'x-access-token': returnedloginData.accessToken
      };
      request.post({url: "http://localhost:3033/api/admin/create-user", form:userData, headers: headers}, (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it("Status 200", () => {
      expect(data.status).toBe(200);
    });
    it("Body", () => {
      expect(data.body.message).toBe("User was registered successfully!");
    });
  });
  
  //test create agent from admin crear-user API without authentication
  describe("POST /api/admin/create-user without login credintials", () => {
    var data = {}, 
    userData = {
      "username": "hala",
      "nickname": "halaUser",
      "password": "12345",
      "confirmPassword": "12345",
      "phone": "2228220",
      "tel": "0569137015",
      "role": "agent"
    }
    beforeAll((done) => {
      request.post({url: "http://localhost:3033/api/admin/create-user", form:userData}, (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it("Status 200", () => {
      expect(data.status).toBe(500);
    });
    it("Body", () => {
      expect(data.body.message).toBe("No token provided!");
    });
  });
  
  //test create service from admin add-service API
  describe("POST /api/admin/add-service", () => {
    var data = {},
    returnedloginData = {},
    postData = {
      username:'AD-001',
      password:'12345'
    },
    service =   {
      "serviceName": "تأمين الشامل للسيارات",
      "coverageDays": 1,
      "cost": 200,
      "dailyCost": 100
    };
    beforeAll((done) => {
      request.post({url: "http://localhost:3033/api/login", form:postData}, (error, response, body) => {
        returnedloginData = JSON.parse(body);
        done();
      });
    });
    beforeAll((done) => {
      let headers = {
        'x-access-token': returnedloginData.accessToken
      };
      request.post({url: "http://localhost:3033/api/admin/add-service", form:service, headers: headers}, (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it("Status 200", () => {
      expect(data.status).toBe(200);
    });
    it("Body", () => {
      expect(data.body.message).toBe("Service was added successfully!");
    });
  });
});