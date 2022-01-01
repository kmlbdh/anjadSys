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
  var server, 
  postData = {
    username:'AD-001',
    password:'12345'
  },
  loginData = {},
  returnedData = {};
  beforeAll(() => {
    server = require("../index");
  });
  afterAll(() => {
    server.close();
  });

  describe("Admin functionality", () => {
    //test login API
    describe("POST /api/login", () => {
      beforeAll((done) => {
        request.post({url: "http://localhost:3033/api/login", form:postData}, (error, response, body) => {
          loginData.status = response.statusCode;
          loginData.body = JSON.parse(body).data;
          done();
        });
      });
      it("Status 200", () => {
        expect(loginData.status).toBe(200);
      });
      it("Body", () => {
        expect(loginData.body.id).toBe("AD-001");
        expect(loginData.body.username).toBe("obada");
        expect(loginData.body.nickname).toBe("newUser");
        expect(loginData.body.role).toBe("admin");
        expect(loginData.body.accessToken).toBeDefined();
      });

    });

    //test create agent from admin crear-user API
    describe("POST /api/admin/create-user", () => {
      var data = {},
      userAgentData =   {
        "username": "hala",
        "nickname": "halaUser",
        "password": "12345",
        "confirmPassword": "12345",
        "phone": "2228220",
        "tel": "0569137015",
        "role": "agent"
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/create-user", form:userAgentData, headers: headers}, (error, response, body) => {
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

    //test create SUPPLIER from admin crear-user API
    describe("POST /api/admin/create-supplier", () => {
      var data = {},
      userData = {
        "username": "supp1",
        "nickname": "newSup",
        "address": "Hebron - west bank",
        "phone": "0599232211",
        "tel": "022282220"
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/create-supplier", form:userData, headers: headers}, (error, response, body) => {
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

    //test list users from admin list-users API
    describe("POST /api/admin/list-users", () => {
      var data = {};
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/list-users", form:{}, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.data).toBeDefined();
        expect(data.body.data.length).toEqual(3);
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

    //test create supplier parts from admin add-supplier-part API
    describe("POST /api/admin/add-supplier-part", () => {
      var data = {},
      supplierPartsAdd = {
        "partName": "part 2",
        "quantity": 1,
        "cost": 130,
        "supplierID": "SUP-00001"
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/add-supplier-part", form:supplierPartsAdd, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          setTimeout(() => done(), 1000);
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toBe("supplier part was added successfully!");
        expect(data.body.data).toBeDefined();
        returnedData.supplierPartsID = data.body.data._id;
      });
    });  

    //test create service from admin add-service API
    describe("POST /api/admin/add-service", () => {
      var data = {},
      service =   {
        "serviceName": "تأمين الشامل للسيارات",
        "coverageDays": 1,
        "cost": 200,
        "dailyCost": 100
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/add-service", form:service, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          setTimeout(() => done(), 1000);
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toBe("Service was added successfully!");
        expect(data.body.data).toBeDefined();
        returnedData.serviceID = data.body.data._id;
      });
    });  
    
    //test list service from admin list-services API
    describe("POST /api/admin/list-services", () => {
      var data = {};
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/list-services", form:{}, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.data).toBeDefined();
        expect(data.body.data.length).toEqual(1);
      });
    });

    //test list supplier parts from admin list-supplier-parts API
    describe("POST /api/admin/list-supplier-parts", () => {
      var data = {};
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/list-supplier-parts", form:{}, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.data).toBeDefined();
        expect(data.body.data.length).toEqual(1);
      });
    });

    //test add agent limits from admin add-agent-limits API
    describe("POST /api/admin/add-agent-limits", () => {
      var dataAgentLimits = {},
      agentLimits = {
        "limitAmount": 2000,
        "agentID": "AG-000001"
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/add-agent-limits", form:agentLimits, headers: headers}, (error, response, body) => {
          dataAgentLimits.status = response.statusCode;
          dataAgentLimits.body = JSON.parse(body);
          setTimeout(() => done(), 1000);
        });
      });
      it("Status 200", () => {
        expect(dataAgentLimits.status).toBe(200);
      });
      it("Body", () => {
        expect(dataAgentLimits.body.message).toBe("agent limits was added successfully!");
        expect(dataAgentLimits.body.data).toBeDefined();
        returnedData.agentLimitsID = dataAgentLimits.body.data._id;
      });
    });

    //test list agent limits from admin list-main-agent-limits API
    describe("POST /api/admin/list-main-agent-limits", () => {
      var data = {},
      listAgentLimits = {
        "agentID": "AG-000001"
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/list-main-agent-limits", form:listAgentLimits, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.data).toBeDefined();
        expect(data.body.data.length).toEqual(1);
      });
    });
  });

  describe("Agent functionality", () => {
    var loginAgentData = {}, returnedAgentData = {},
    agent = {
      "username": "AG-000001",
      "password": "12345"
    }
    describe("POST /api/login", () => {
      beforeAll((done) => {
        request.post({url: "http://localhost:3033/api/login", form:agent}, (error, response, body) => {
          loginAgentData.status = response.statusCode;
          loginAgentData.body = JSON.parse(body).data;
          done();
        });
      });
      it("Status 200", () => {
        expect(loginAgentData.status).toBe(200);
      });
      it("Body", () => {
        expect(loginAgentData.body.id).toBe("AG-000001");
        expect(loginAgentData.body.username).toBe("hala");
        expect(loginAgentData.body.nickname).toBe("halaUser");
        expect(loginAgentData.body.role).toBe("agent");
        expect(loginAgentData.body.accessToken).toBeDefined();
      });
    });

     //test create customer from agent crear-user API
     describe("POST /api/agent/create-user", () => {
      var data = {},
      userData = {
        "username": "cust",
        "nickname": "cust1",
        "password": "12345",
        "confirmPassword": "12345",
        "address": "hebron - palestine",
        "phone": "2228220",
        "tel": "0569137015"
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginAgentData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/agent/create-user", form:userData, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          returnedAgentData.userID = data.body.data._id;
          setTimeout(() => done(), 1000);
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toBe("User was registered successfully!");
        expect(data.body.data.role).toEqual("customer");
      });
    });

    //test list users from agent list-users API
    describe("POST /api/admin/list-users", () => {
      var data = {};
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginAgentData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/agent/list-users", form:{}, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.data).toBeDefined();
        expect(data.body.data.length).toEqual(1);
      });
    });

    //test add customer service from agent add-customer-service API
    describe("POST /api/agent/add-customer-service", () => {
      var data = {};
      beforeAll((done) => {
        var customerService = {
          "userID": "C-00000001",
          "serviceID": returnedData.serviceID,
          "serviceName":"2 تأمين الشامل للسيارات",
          "price": 200,
          "period": 365,
          "additionalDays": 3,
          "dailyCost": 50,
          "startDate": "2022-12-26",
          "endDate": "2023-12-26"
        };
        let headers = {
          'x-access-token': loginAgentData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/agent/add-customer-service", form:customerService, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          setTimeout(() => done(), 1000);
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toEqual("service is added to the customer!");
        expect(data.body.data).toBeDefined();
        returnedAgentData.customerServiceID = data.body.data.customerService._id;
      });
    });

    //test delete customer service from agent list-users API
    describe("POST /api/agent/delete-customer-service", () => {
      var data = {};
      beforeAll((done) => {
        var deleteCustomerService = {
          "customerServiceID": returnedAgentData.customerServiceID
        };
        let headers = {
          'x-access-token': loginAgentData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/agent/delete-customer-service", form:deleteCustomerService, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toEqual("service is deleted from the customer!");
        expect(data.body.data).toBeDefined();
      });
    });

    //test delete customer from agent delete-user API
    describe("POST /api/agent/delete-user", () => {
      var data = {},
      user = {
        "username": "C-00000001"
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginAgentData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/agent/delete-user", form:user, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toEqual("User was removed successfully!");
      });
    });
  });

  describe("Admin functionality of clearing data", () => {
    //test delete agent from admin delete-user API
    describe("POST /api/admin/delete-user", () => {
      var data = {},
      agent = {
        "username": "AG-000001"
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/delete-user", form:agent, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toEqual("User was removed successfully!");
      });
    });

    //test delete Supplier from admin delete-user API
    describe("POST /api/admin/delete-user", () => {
      var data = {},
      agent = {
        "username": "SUP-00001"
      };
      beforeAll((done) => {
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/delete-user", form:agent, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toEqual("User was removed successfully!");
      });
    });

    //test delete agent limits from admin delete-agent-limits API
    describe("POST /api/admin/delete-agent-limits", () => {
      var data = {};
      beforeAll((done) => {
      var agent = {
          "agentLimitID": returnedData.agentLimitsID
        };
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/delete-agent-limits", form:agent, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toEqual("agent limits was deleted successfully!");
      });
    });

    //test delete supplier parts from admin delete-supplier-part API
    describe("POST /api/admin/delete-supplier-part", () => {
      var data = {};
      beforeAll((done) => {
        supplierParts = {
          "supplierPartsID": returnedData.supplierPartsID
        };
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/delete-supplier-part", form:supplierParts, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toEqual("supplier part was deleted successfully!");
      });
    });

    //test delete service from admin delete-service API
    describe("POST /api/admin/delete-service", () => {
      var data = {};
      beforeAll((done) => {
        deleteService = {
          "serviceID": returnedData.serviceID
        };
        let headers = {
          'x-access-token': loginData.body.accessToken
        };
        request.post({url: "http://localhost:3033/api/admin/delete-service", form:deleteService, headers: headers}, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it("Status 200", () => {
        expect(data.status).toBe(200);
      });
      it("Body", () => {
        expect(data.body.message).toEqual("Service was added successfully!");
      });
    });
  });


});