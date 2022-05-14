'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "CarTypes", deps: []
 * createTable "Regions", deps: []
 * createTable "Roles", deps: []
 * createTable "Services", deps: []
 * createTable "CarModels", deps: [CarTypes]
 * createTable "Users", deps: [Regions, Roles, Users]
 * createTable "Cars", deps: [Users, CarTypes, CarModels]
 * createTable "InsurancePolicies", deps: [Cars, Users, Users]
 * createTable "Accidents", deps: [Users, Users, Cars, Regions]
 * createTable "OtherServices", deps: [Users]
 * createTable "Accounts", deps: [InsurancePolicies, Users, OtherServices]
 * createTable "ServiceAccidents", deps: [Accidents, Services, Users]
 * createTable "ServicePolicies", deps: [InsurancePolicies, Services, Users]
 *
 **/

var info = {
    "revision": 1,
    "name": "db",
    "created": "2022-04-27T13:28:26.713Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "CarTypes",
            {
                "id": {
                    "type": Sequelize.SMALLINT.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(20),
                    "field": "name",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Regions",
            {
                "id": {
                    "type": Sequelize.TINYINT.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(20),
                    "field": "name",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Roles",
            {
                "id": {
                    "type": Sequelize.TINYINT.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(50),
                    "field": "name",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Services",
            {
                "id": {
                    "type": Sequelize.MEDIUMINT.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(100),
                    "field": "name",
                    "unique": true,
                    "allowNull": false
                },
                "cost": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "cost",
                    "allowNull": false
                },
                "coverageDays": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "coverageDays",
                    "allowNull": false
                },
                "supplierPercentage": {
                    "type": Sequelize.FLOAT,
                    "field": "supplierPercentage",
                    "allowNull": false
                },
                "note": {
                    "type": Sequelize.TEXT,
                    "field": "note",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "CarModels",
            {
                "id": {
                    "type": Sequelize.SMALLINT.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(20),
                    "field": "name",
                    "unique": true,
                    "allowNull": false
                },
                "carTypeId": {
                    "type": Sequelize.SMALLINT.UNSIGNED,
                    "field": "carTypeId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "CarTypes",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Users",
            {
                "id": {
                    "type": Sequelize.STRING(10),
                    "field": "id",
                    "primaryKey": true
                },
                "identityNum": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "identityNum",
                    "unique": true,
                    "allowNull": false
                },
                "username": {
                    "type": Sequelize.STRING(100),
                    "field": "username",
                    "allowNull": false,
                    "unique": true
                },
                "companyName": {
                    "type": Sequelize.STRING(100),
                    "field": "companyName"
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password"
                },
                "address": {
                    "type": Sequelize.STRING(100),
                    "field": "address"
                },
                "jawwal1": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "jawwal1",
                    "unique": true
                },
                "jawwal2": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "jawwal2",
                    "unique": true
                },
                "fax": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "fax",
                    "unique": true
                },
                "tel": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "tel",
                    "unique": true
                },
                "email": {
                    "type": Sequelize.STRING(100),
                    "field": "email",
                    "unique": true
                },
                "note": {
                    "type": Sequelize.TEXT,
                    "field": "note"
                },
                "blocked": {
                    "type": Sequelize.BOOLEAN,
                    "field": "blocked",
                    "allowNull": false,
                    "defaultValue": 0
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "regionId": {
                    "type": Sequelize.TINYINT.UNSIGNED,
                    "field": "regionId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Regions",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "roleId": {
                    "type": Sequelize.TINYINT.UNSIGNED,
                    "field": "roleId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Roles",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "agentId": {
                    "type": Sequelize.STRING(10),
                    "field": "agentId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Cars",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true,
                    "unique": true,
                    "allowNull": false
                },
                "carNumber": {
                    "type": Sequelize.STRING(10),
                    "field": "carNumber",
                    "unique": true,
                    "allowNull": false
                },
                "motorNumber": {
                    "type": Sequelize.STRING(8),
                    "field": "motorNumber",
                    "allowNull": false,
                    "unique": true
                },
                "motorPH": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "motorPH"
                },
                "licenseType": {
                    "type": Sequelize.STRING(12),
                    "field": "licenseType",
                    "allowNull": false
                },
                "serialNumber": {
                    "type": Sequelize.STRING(17),
                    "field": "serialNumber"
                },
                "passengersCount": {
                    "type": Sequelize.TINYINT.UNSIGNED,
                    "field": "passengersCount"
                },
                "productionYear": {
                    "type": Sequelize.DATEONLY,
                    "field": "productionYear"
                },
                "note": {
                    "type": Sequelize.TEXT,
                    "field": "note"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "customerId": {
                    "type": Sequelize.STRING(10),
                    "field": "customerId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "carTypeId": {
                    "type": Sequelize.SMALLINT.UNSIGNED,
                    "field": "carTypeId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "CarTypes",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "carModelId": {
                    "type": Sequelize.SMALLINT.UNSIGNED,
                    "field": "carModelId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "CarModels",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "InsurancePolicies",
            {
                "id": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "totalPrice": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "totalPrice",
                    "allowNull": false
                },
                "expireDate": {
                    "type": Sequelize.DATEONLY,
                    "field": "expireDate",
                    "allowNull": false
                },
                "note": {
                    "type": Sequelize.TEXT,
                    "field": "note"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "carId": {
                    "type": Sequelize.INTEGER,
                    "field": "carId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Cars",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "customerId": {
                    "type": Sequelize.STRING(10),
                    "field": "customerId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "agentId": {
                    "type": Sequelize.STRING(10),
                    "field": "agentId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Accidents",
            {
                "id": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(100),
                    "field": "name",
                    "unique": true,
                    "allowNull": false
                },
                "accidentPlace": {
                    "type": Sequelize.STRING(100),
                    "field": "accidentPlace",
                    "allowNull": false
                },
                "accidentDate": {
                    "type": Sequelize.DATE,
                    "field": "accidentDate"
                },
                "registerAccidentDate": {
                    "type": Sequelize.DATE,
                    "field": "registerAccidentDate"
                },
                "driverName": {
                    "type": Sequelize.STRING(100),
                    "field": "driverName"
                },
                "driverIdentity": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "driverIdentity"
                },
                "accidentDescription": {
                    "type": Sequelize.TEXT,
                    "field": "accidentDescription"
                },
                "expectedCost": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "expectedCost"
                },
                "note": {
                    "type": Sequelize.TEXT,
                    "field": "note"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "customerId": {
                    "type": Sequelize.STRING(10),
                    "field": "customerId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "agentId": {
                    "type": Sequelize.STRING(10),
                    "field": "agentId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "carId": {
                    "type": Sequelize.INTEGER,
                    "field": "carId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Cars",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "regionId": {
                    "type": Sequelize.TINYINT.UNSIGNED,
                    "field": "regionId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Regions",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "OtherServices",
            {
                "id": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(200),
                    "field": "name",
                    "allowNull": false
                },
                "serviceKind": {
                    "type": Sequelize.STRING(100),
                    "field": "serviceKind",
                    "allowNull": false
                },
                "fileStatus": {
                    "type": Sequelize.STRING(10),
                    "field": "fileStatus",
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.TEXT,
                    "field": "description",
                    "allowNull": false
                },
                "cost": {
                    "type": Sequelize.FLOAT,
                    "field": "cost",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "customerId": {
                    "type": Sequelize.STRING(10),
                    "field": "customerId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Accounts",
            {
                "id": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "credit": {
                    "type": Sequelize.DECIMAL,
                    "field": "credit"
                },
                "debit": {
                    "type": Sequelize.DECIMAL,
                    "field": "debit"
                },
                "note": {
                    "type": Sequelize.TEXT,
                    "field": "note"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "insurancePolicyId": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "insurancePolicyId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "InsurancePolicies",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "agentId": {
                    "type": Sequelize.STRING(10),
                    "field": "agentId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "otherServiceId": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "otherServiceId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "OtherServices",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "ServiceAccidents",
            {
                "id": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "coverageDays": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "coverageDays",
                    "allowNull": false
                },
                "note": {
                    "type": Sequelize.TEXT,
                    "field": "note"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "accidentId": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "accidentId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Accidents",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "serviceId": {
                    "type": Sequelize.MEDIUMINT.UNSIGNED,
                    "field": "serviceId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Services",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "supplierId": {
                    "type": Sequelize.STRING(10),
                    "field": "supplierId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "ServicePolicies",
            {
                "id": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "cost": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "cost",
                    "allowNull": false
                },
                "supplierPercentage": {
                    "type": Sequelize.FLOAT.UNSIGNED,
                    "field": "supplierPercentage",
                    "allowNull": false
                },
                "additionalDays": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "additionalDays",
                    "allowNull": false
                },
                "note": {
                    "type": Sequelize.TEXT,
                    "field": "note"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "insurancePolicyId": {
                    "type": Sequelize.INTEGER.UNSIGNED,
                    "field": "insurancePolicyId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "InsurancePolicies",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "serviceId": {
                    "type": Sequelize.MEDIUMINT.UNSIGNED,
                    "field": "serviceId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Services",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "supplierId": {
                    "type": Sequelize.STRING(10),
                    "field": "supplierId",
                    "onUpdate": "RESTRICT",
                    "onDelete": "RESTRICT",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
