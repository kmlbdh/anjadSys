/*
deleteInsurancePolicy(id: number): Observable<any>{
  return this.http.post<any>(`${this.url}delete-insurance-policy`, {insurancePolicyId: id}).pipe(
    catchError(this.handleError)
  );
}

updateInsurancePolicy(insurancePolicyData: updateInsurancePolicy):Observable<any>{
  return this.http.post<any>(`${this.url}edit-insurance-policy`, insurancePolicyData).pipe(
    catchError(this.handleError)
  );
}

deleteAccident(id: number): Observable<any>{
  return this.http.post<any>(`${this.url}delete-accident`, {accidentID: id}).pipe(
    catchError(this.handleError)
  );
}

updateCar(carData: updateCar): Observable<any>{
  return this.http.post<any>(`${this.url}edit-car`, carData).pipe(
    catchError(this.handleError)
  );
}

deleteCar(id: string): Observable<any>{
  return this.http.post<any>(`${this.url}delete-car`, {carId: id}).pipe(
    catchError(this.handleError)
  );
}

updateUser(userData: updateUser): Observable<any>{
  return this.http.post<any>(`${this.url}edit-user`, userData).pipe(
    catchError(this.handleError)
  );
}

deleteUser(id: string): Observable<any>{
  return this.http.post<any>(`${this.url}delete-user`, {username: id}).pipe(
    catchError(this.handleError)
  );
}
*/

/*

          <div class="form-control-group">
            <label for="password">كلمة المرور</label>
            <input id="password" type="password" name="password" formControlName="password"/>

            <div *ngIf="(form.submitted || formCont('password')?.touched) &&
             formCont('password')?.invalid" class="alert alert-danger">

              <div *ngIf="formCont('password').hasError('required')">كلمة المرور مطلوب تعبئته</div>
            </div>
          </div>

          <div class="form-control-group">
            <label for="confirmPassword">تأكيد كلمة المرور</label>
            <input id="confirmPassword" type="password" name="confirmPassword"
            formControlName="confirmPassword"/>

            <div *ngIf="(form.submitted || formCont('confirmPassword')?.touched)
             && formCont('confirmPassword')?.invalid" class="alert alert-danger">

              <div *ngIf="formCont('confirmPassword').hasError('required')">
                تأكيد كلمة المرور مطلوب تعبئته</div>
              <div *ngIf="formCont('confirmPassword').hasError('mismatch')">
                حقل تأكيد كلمة المرور لا يطابق حقل كلمة المرور</div>
            </div>
          </div>
 */





/** #################################### BACK END ##############################*/

          /*
    update: Joi.object().keys({
      insurancePolicyId: Joi.number().required(),
      totalPrice: Joi.number().optional(),
      note: Joi.any().optional(),
      services: Joi.array().items(ServicePolicy).optional(),
      customerId: Joi.string().optional(),
      carId: Joi.number().optional(),
    }),
    delete: Joi.object().keys({
      insurancePolicyId: Joi.number().required()
    }),

    update: Joi.object().keys({
      accidentId: Joi.number().required(),
      name: Joi.string().trim().optional(),
      accidentPlace: Joi.string().trim().optional(),
      accidentDate: Joi.date().optional(),
      registerAccidentDate: Joi.date().optional(),
      driverName: Joi.string().trim().optional(),
      driverIdentity: Joi.number().min(1).optional(),
      accidentDescription: Joi.string().trim().optional(),
      expectedCost: Joi.number().optional(),
      note: Joi.any().optional(),
      services: Joi.array().optional(),
      regionId: Joi.number().optional(),
      customerId: Joi.number().optional(),
      carId: Joi.number().optional(),
    }),
    delete: Joi.object().keys({
      accidentID: Joi.number().required()
    }),

    update: Joi.object().keys({
      carId: Joi.number().required(),
      carNumber: Joi.string().trim().optional(),
      motorNumber: Joi.string().trim().optional(),
      motorPH: Joi.number().min(10).optional(),
      serialNumber: Joi.string().trim().optional(),
      passengersCount: Joi.number().min(1).optional(),
      productionYear: Joi.date().optional(),
      licenseType: Joi.string().optional(),
      note: Joi.any().optional(),
      carTypeId: Joi.number().optional(),
      carModelId: Joi.number().optional(),
      customerID: Joi.string().optional(),
    }),
    delete: Joi.object().keys({
      carId: Joi.number().required()
    }),

    update: Joi.object().keys({
      id: Joi.string().trim().min(6).required(),
      identityNum: Joi.string()
      .pattern(/^[0-9]{9}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الهوية خاطىء' } })
      .optional(),
      username: Joi.string().trim().optional(),
      companyName: Joi.string().optional(),
      password: Joi.string().trim().optional().label('password'),
      confirmPassword: Joi.any()
        .equal(Joi.ref('password'))
        .optional()
        .strip() //remove it from body after validation
        .label("Confirm password")
        .options({ messages: { 'any.only': '{{#label}} doesn\'t match' } }),
      address: Joi.string().trim().optional(),
      jawwal1: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الجوال الأول خاطىء' } })
      .optional(),
      jawwal2: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الجوال الثاني خاطىء' } })
      .optional(),
      fax: Joi.number().min(7).optional(),
      tel: Joi.number().min(7).optional(),
      email: Joi.string().email()
      .options({ messages: { 'string.email.base': 'البريد الالكتروني خاطىء' } })
      .optional(),
      note: Joi.string().trim().optional(),
      regionId: Joi.number().min(1).optional(),
    }),
    delete: Joi.object().keys({
      username: Joi.string().trim()
      .pattern(/^(C-\d{8})$/)
      .required()
      .options({messages: {"string.pattern.base": "username is wrong!"}})
    }),


    CONTROLLER AGENT

    delete: async(req, res) => {
    try {
      let { accidentID } = req.body;

      // let accidentExistance = await Accident.findOne({ where: { id: accidentID, agentId: req.agent.id  }});

      // if(!accidentExistance && !accidentExistance.id)
      //   throw new customError("Failed! There is no such accident!", INTERR);

      await sequelizeDB.transaction( async t => {
        const deletedAccidentServices = await ServiceAccident.destroy({
          where: { accidentId: accidentID},
          include:[
            {
              model: Accident,
              required: true,
              where: { agentId: req.agent.id }
            }],
          },
        {transaction: t});

        if(!deletedAccidentServices)
          throw new customError("Failed! Accident isn't deleted!", INTERR);

        const deletedAccident = await Accident.destroy({ where: { id: accidentID, agentId: req.agent.id  }},
          {transaction: t});

        if(!deletedAccident)
          throw new customError("Failed! Accident isn't deleted!", INTERR);

        res.status(200).json({
          message: "Accident was deleted successfully!",
          data: {accident: deletedAccident, serviceAccidents: deletedAccidentServices}
        });
      });

    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! Accident isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let {
        accidentID,
        services
       } = req.body;

      if(!accidentID)
        throw new customError("Failed! Accident data isn't provided!", INTERR);

      const query = { where: {id: accidentID, agentId: req.agent.id} };
      const updateData = {};

      Object.entries(req.body).forEach((val, ind) => {
        updateServiceLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'accidentID' && val[0] !== 'services')
          updateData[val[0]] = val[1];
      });

      updateServiceLog(updateData);
      const updatedAccident = await Accident.update(updateData, query);

      if(updatedAccident[0]!== 1)
        throw new customError("Failed! Accident isn't updated!", INTERR);

      let serviceAccidentObj = [];
      let servAccIds = [];

      services.forEach((service, i) => {
        if(service.id)
          servAccIds.push(service.id);

        serviceAccidentObj[i] = {
          id: service.id,
          cost: service.cost,
          additionalDays: service.additionalDays,
          note: service.note,
          serviceId: service.serviceId,
          supplierId: service.supplierId,
          accidentId: accidentID
        };
      });

      //delete services that are not provided by ids
      const deletedServiceAccident = await ServiceAccident.destroy({
        where: {
          [Op.and]: {
            id:{ [Op.notIn]: [...servAccIds] },
            accidentId: accidentID
          }
        }
      },
      { transaction: t});

      //update exist one and add the new services
      const updateServiceAccidents = await ServiceAccident.bulkCreate(serviceAccidentObj,
        { updateOnDuplicate: ["id"] , transaction: t});


      updateServiceLog(deletedServiceAccident);
      res.status(200).json({
        message: "Accident was updated successfully!",
        data: {
          accident: updatedAccident[0],
          serviceAccidents: updateServiceAccidents[0],
          deletedServiceAccidents: deletedServiceAccident
        }
      });
    } catch(error) {
      updateServiceLog(error);
      errorHandler(res, error, "Failed! Accident wasn't updated!");
    }
  },



    delete: async(req, res) => {
    try {
      let { insurancePolicyId } = req.body;

      await sequelizeDB.transaction( async t => {
        const deletedServicesPolicy = await ServicePolicy.destroy({
          where: { insurancePolicyId: insurancePolicyId },
          include:[
            {
              model: InsurancePolicy,
              required: true,
              where: { agentId: req.agent.id }
            }],
          },
        { transaction: t });

        if(!deletedServicesPolicy)
          throw new customError("Failed! Services Policy isn't deleted!", INTERR);

        const deletedInsurancePolicy = await InsurancePolicy.destroy(
          { where: { id: insurancePolicyId, agentId: req.agent.id }},
          { transaction: t });

        if(!deletedInsurancePolicy)
          throw new customError("Failed! Insurance Policy isn't deleted!", INTERR);

        const deletedAccount = await Account.destroy({ where: { insurancePolicyId: insurancePolicyId }},
          {transaction: t});

        if(!deletedAccount)
          throw new customError("Failed! Account wasn't deleted!", INTERR);

        res.status(200).json({
          message: "Insurance Policy was deleted successfully!",
          data: { insurancePolicy: deletedInsurancePolicy, servicesPolicy: deletedServicesPolicy }
        });
      });

    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! Insurance Policy isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let {
        insurancePolicyId,
        services
       } = req.body;

      if(!insurancePolicyId)
        throw new customError("Failed! Insurance Policy data isn't provided!", INTERR);

      await sequelizeDB.transaction( async t => {
        const query = { where: {id: insurancePolicyId, agentId: req.agent.id} };
        const updateData = {};

        Object.entries(req.body).forEach((val, ind) => {
          updateServiceLog(val[0], val[1])
          if(val && val.length > 0 && val[0] !== 'insurancePolicyId' && val[0] !== 'services')
            updateData[val[0]] = val[1];
        });

        updateServiceLog(updateData);
        const updatedInsurancePolicy = await InsurancePolicy.update(updateData, query);

        if(updatedInsurancePolicy[0]!== 1)
          throw new customError("Failed! Insurance Policy isn't updated!", INTERR);

        let servicePolicyObj = [];
        let servAPolicyIds = [];

        services.forEach((service, i) => {
          if(service.id)
            servAPolicyIds.push(service.id);

            servicePolicyObj[i] = {
              id: service.id,
              cost: service.cost,
              additionalDays: service.additionalDays,
              note: service.note,
              serviceId: service.serviceId,
              supplierId: service.supplierId,
              insurancePolicyId: insurancePolicyId
            };
        });

        //delete services that are not provided by ids
        const deletedServicePolicy = await ServicePolicy.destroy({
          where: {
            [Op.and]: {
              id:{ [Op.notIn]: [...servAPolicyIds] },
              insurancePolicyId: insurancePolicyId
            }
          }
        },
        { transaction: t });

        //update exist one and add the new services
        const updateServicesPolicy = await ServicePolicy.bulkCreate(servicePolicyObj,
          { updateOnDuplicate: ["id"] , transaction: t});

        const updatedAccount = await Account.update({credit: totalPrice}, {where: {insurancePolicyId: insurancePolicyId}}, { transaction: t});

        if(!updatedAccount)
          throw new customError("Failed! Account wasn't updated!", INTERR);


        updateServiceLog(deletedServicePolicy);
        res.status(200).json({
          message: "Insurance Policy was updated successfully!",
          data: {
            insurancePolicy: updatedInsurancePolicy[0],
            servicesPolicy: updateServicesPolicy[0],
            deletedServicesPolicy: deletedServicePolicy
          }
        });
      });

    } catch(error) {
      updateServiceLog(error);
      errorHandler(res, error, "Failed! Insurance Policy wasn't updated!");
    }
  },




  delete: async(req, res) => {
    try {
      let { carId } = req.body;

      const deletedCar = await Car.destroy({
        where: { id: carId, '$Customer.agentId$': req.agent.id },
        include: [
          {
            model: User,
            as: 'Customer',
            require: true
          }
        ]
      });

      if(!deletedCar)
        throw new customError("Failed! Car isn't deleted!", INTERR);

      res.status(200).json({
        message: "Car was deleted successfully!",
        data: deletedCar
      });
    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! Car isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { carId } = req.body;

      const query = {
        where: {id: carId},
        include: {
          model: User,
          as: 'Customer',
          require: true,
          where: {'agentId': req.agent.id}
        }
      };
      const updateData = {};
      Object.entries(req.body).forEach((val, ind) => {
        updateUserLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'carId')
          updateData[val[0]] = val[1];
      });
      updateUserLog(updateData, query);

      const updatedCar = await Car.update(updateData, query);
      updateUserLog(updatedCar[0]);

      if(updatedCar[0]!== 1)
        throw new customError("Failed! Car isn't updated!", INTERR);

      res.status(200).json({message: "Car was updated successfully!", data: updatedCar[0]});

    } catch(error) {
      updateUserLog(error);
      errorHandler(res, error, "Failed! Car wasn't registered!");
    }
  },


    delete: async(req, res) => {
    const { username } = req.body;
    query = { where: { id: username, agentId: req.agent.id }};

    await userShared.deleteUser(res, query);
  },
  update: async(req, res) => {
    try {
      let { id } = req.body;

      if(!id)
        throw new customError("Failed! user data isn't provided!", INTERR);

      const query = { where: {id, agentId: req.agent.id} };
      const updateData = {};
      Object.entries(req.body).forEach((val, ind) => {
        updateUserLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'id')
          updateData[val[0]] = val[1];
      });
      updateUserLog(updateData, query);
      await userShared.updateUser(res, query, updateData);
    } catch(error) {
      updateUserLog(error);
      errorHandler(res, error, "Failed! User wasn't registered!");
    }
  },










  ROUTE AGENT

  app.post("/api/agent/edit-user",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.update,
  ], userActions.update);

  app.post("/api/agent/delete-user",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.delete,
  ], userActions.delete);

  app.post("/api/agent/edit-car",[
    auth.verifyToken,
    auth.isAgent,
    carValidation.update,
  ], carActions.update);

  app.post("/api/agent/delete-car",[
    auth.verifyToken,
    auth.isAgent,
    carValidation.delete,
  ], carActions.delete);

  app.post("/api/agent/edit-accident",[
    auth.verifyToken,
    auth.isAgent,
    accidentValidation.update,
  ], accidentActions.update);

  app.post("/api/agent/delete-accident",[
    auth.verifyToken,
    auth.isAgent,
    accidentValidation.delete,
  ], accidentActions.delete);

  app.post("/api/agent/edit-insurance-policy",[
    auth.verifyToken,
    auth.isAgent,
    insurancePolicyValidation.update,
  ], insurancePolicyActions.update);

  app.post("/api/agent/delete-insurance-policy",[
    auth.verifyToken,
    auth.isAgent,
    insurancePolicyValidation.delete,
  ], insurancePolicyActions.delete);

*/
