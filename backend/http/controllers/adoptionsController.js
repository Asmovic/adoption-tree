const { v4: uuidV4 } = require('uuid');
const db = require('../../lib/knexConnection');
const { validateAdoptionRequest } = require('../../schemas/adoptions/adoptionRequestSchema');
const genders = require('./../../constants/genders');
const roles = require('./../../constants/roles');
const { paymentChannels,
  categories: adoptionCategories } = require('./../../constants/adoptionRequests');
const { savePayment } = require('./../../services/PaymentService');
// const flutterwaveService = require('./../../services/gateways/FlutterwaveService');
const paystackService = require('./../../services/gateways/PaystackService');
const registrationRepository = require('./../../repositories/RegistrationRepository');
const { ErrorHandler } = require('../helpers/ErrorHandler');
const { generateRandomPassword, generateRandomNumber } = require('./../../lib/utils');
const { generatePassword } = require('./../../lib/auth/security');
const newAdoptionRequestNotification = require('../../notifications/newAdoptionRequestNotification');
const moment = require('moment');
const xlsx = require('xlsx');
const { unlinkSync } = require('fs');
const { downloadData } = require('../helpers/dataExport');

const {
  ADOPTION_RATES,
  ADOPTION_REQUESTS,
  TEMP_ENROLLEES,
  USERS,
  LGAS,
  PAYMENTS,
} = require('./../../config/dbConfig').tableNames;

exports.index = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 25,
      lgaId,
      category,
      durationType,
      download,
      startDate,
      endDate,
      paymentStatus,
    } = req.query;

    const { data, pagination } =
      await db.select({
        ar: 'ar.*',
        lga: 'l.name',
        user: db.raw('CONCAT(u."firstName", \' \', u."lastName")'),
        paymentStatus: 'p.status',
      })
        .from({ ar: ADOPTION_REQUESTS })
        .innerJoin({ u: USERS }, 'ar.userId', '=', 'u.id')
        .leftJoin({ l: LGAS }, 'ar.lgaId', '=', 'l.id')
        .leftJoin({ p: PAYMENTS }, 'ar.paymentId', '=', 'p.id')
        .modify(function (queryBuilder) {
          if (lgaId) {
            queryBuilder.where('ar.lgaId', '=', lgaId);
          }
          if (category) {
            queryBuilder.where('ar.category', '=', category);
          }
          if (durationType) {
            queryBuilder.where('ar.durationType', '=', durationType);
          }
          if (paymentStatus) {
            queryBuilder.where('p.status', '=', paymentStatus);
          }
        })
        .dateFilter('ar.createdAt', startDate, endDate)
        .orderBy('ar.createdAt', 'desc')
        .paginate({ perPage, currentPage: page });

    if (download === 'true') {
      const fields = getExportFields();
      return downloadData(res, 'adoptions.csv', fields, data);
    }

    return res.json({ data, pagination });
  } catch (error) {
    next(error);
  }
};

exports.myAdoptions = async (req, res, next) => {
  try {
    const { user,
      query } = req;
    const page = query.page || 1;

    const adoptions = await db(ADOPTION_REQUESTS)
      .where('userId', '=', user.id)
      .orderBy('id', 'desc')
      .paginate({
        perPage: 25,
        currentPage: page,
      });

    return res.json({
      success: true,
      data: adoptions,
    });
  } catch (error) {
    next(error);
  }
};

exports.myPayments = async (req, res, next) => {
  try {
    const { user,
      query } = req;
    const page = query.page || 1;

    const payments = await db(PAYMENTS)
      .where((builder) =>
        builder.where('reference', 'is not', null).orWhere('channel', '=', 'voucher'),
      )
      .andWhere('userId', '=', user.id)
      .orderBy('id', 'desc')
      .paginate({
        perPage: 25,
        currentPage: page,
      });

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

exports.makeRequest = async (req, res, next) => {
  console.log('=====Make==Payment==Request');
  try {
    const validation = await validateAdoptionRequest(req.body);
    if (!validation.isValid) throw new ErrorHandler(400, validation.errors);

    const { user,
      activeRole } = req;

    let {
      lgaId,
      category,
      entryId,
      noOfAdoptees,
      type,
      startDate,
      totalAmount,
      durationType,
      duration,
      paymentType,
      planId,
    } = validation.body;

    if (entryId) {
      const record = await await db
        .select()
        .from(TEMP_ENROLLEES)
        .where({
          id: entryId,
        })
        .first();

      if (!record) {
        // TODO: Throw error
      }

      const tempEnrollees = JSON.parse(record.enrollees);
      noOfAdoptees = tempEnrollees.length;

      let fields = '';
      const item = tempEnrollees[0];

      for (var key in item) {
        if (fields !== '') fields += ',';
        fields += key;
      }

      // In case email isn't supplied
      if (fields !== 'firstName,lastName,phone,email' && fields !== 'firstName,lastName,phone') throw new ErrorHandler(400, 'Invalid columns - expect firstName,lastName,phone,email');
      // Fetch enrolless who exist in the database if any
      const tempEnrolleePhoneNumbers = tempEnrollees.map((x) => x.phone);
      const existingEnrollees = await db
        .select('phone')
        .from(USERS)
        .whereIn('phone', tempEnrolleePhoneNumbers);

      // TODO: Check if those enrollees have existing adoptions
      if (existingEnrollees.length) {
        // Logic goes here
      }

      // Create an object containing phone numbers as keys
      const phoneNumbers = existingEnrollees.reduce((acc, entry) => {
        acc[entry.phone] = entry.phone;
        return acc;
      }, {});

      addEnrollees(tempEnrollees, phoneNumbers);
    }

    // check if theres a self adoption request pending
    if (category === 'self') {
      try {
        const sql = `SELECT *
      FROM ${ADOPTION_REQUESTS} WHERE "userId" = ${user.id}
      AND "planId" = ${planId} and category = 'self'
      AND  (a."noOfAdoptedPersons" < a."noOfAdoptees" OR a."noOfAdoptedPersons" IS NULL) LIMIT 1;`;

        const result = await db.raw(sql);
        const existing = result.rows;
        if (existing.length > 0) {
          const response = {
            success: true,
            data: existing,
          };
          return res.json(response);
        }
      } catch (error) {

      }
    }

    // check that amount is valid for adoptions

    let paymentInsertData = {};

    switch (paymentType) {
      case paymentChannels.debit_card:
        paymentInsertData = await makePayment(paymentType, totalAmount, user, noOfAdoptees, lgaId);
        break;

      case paymentChannels.voucher:
        paymentInsertData = { channel: paymentChannels.voucher, gateway: 'voucher', status: 'pending' };
        break;

      default:
        break;
    }

    const {
      paymentReference,
      paymentLink,
      status,
      gateway,
      channel,
      paymentDate,
    } = paymentInsertData;

    const { payment,
      error } = await savePayment(
      user.id,
      paymentReference,
      totalAmount,
      'pending',
      gateway,
      channel,
      'Adoption payment',
      paymentDate,
    );
    console.log('Inserted Payment:', paymentInsertData);
    if (error) {
      throw new ErrorHandler(500, [{
        message: 'Error saving payment',
      }]);
    }

    const [request] = await db(ADOPTION_REQUESTS)
      .insert({
        userId: user.id,
        lgaId,
        category,
        noOfAdoptees,
        type,
        startDate,
        totalAmount,
        durationType,
        duration,
        paymentProcessed: 'pending',
        paymentType,
        paymentId: payment.id,
        planId,
      })
      .returning('*');
    if (durationType === 'onetime') { newAdoptionRequestNotification.toMail(user, request); }

    const response = {
      success: true,
      data: request,
    };

    if (paymentLink) response.paymentLink = paymentLink;

    return res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.estimate = async (req, res, next) => {
  try {
    // TODO: Add validation
    let {
      durationType,
      noOfAdoptees,
      plan,
      type,
      entries,
    } = req.body;
    let entryId;
    const request = await db
      .select()
      .from(ADOPTION_RATES)
      .where({
        type: plan,
      })
      .first();

    if (!request) {
      throw new ErrorHandler(400, [{
        message: 'No rates found for this plan',
      }]);
    }

    const { onetimeAmount,
      weeklyAmount,
      monthlyAmount } = request;

    const rates = {
      weekly: weeklyAmount,
      monthly: monthlyAmount,
      onetime: onetimeAmount,
    };

    if (type === 'list') {
      const file = req.files.file;
      const entries = await parseAdoptionFile(file);
      entryId = await addTempEnrollees(entries);
      noOfAdoptees = entries.length;
    } else if (type === 'multi-form') {
      entryId = await addTempEnrollees(entries);
    }

    const totalAmount = noOfAdoptees * (rates[durationType]);
    return res.json({
      success: true,
      data: {
        totalAmount,
        entryId,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.rates = async (req, res, next) => {
  // TODO: Validate request
  try {
    const result = await db.select().from(ADOPTION_RATES);
    console.log(result);
    res.json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.paymentDetails = async (req, res, next) => {
  const { params } = req;

  const request = await db(PAYMENTS)
    .where({
      id: params.id,
    })
    .first();

  if (!request) {
    throw new ErrorHandler(404, [{
      message: 'Record not found',
    }]);
  }

  return res.json({
    success: true,
    data: request,
  });
};

exports.details = async (req, res, next) => {
  const { params } = req;

  const request = await db(ADOPTION_REQUESTS)
    .where({
      id: params.id,
    })
    .first();

  if (!request) {
    throw new ErrorHandler(404, [{
      message: 'Record not found',
    }]);
  }

  return res.json({
    success: true,
    data: request,
  });
};

const addEnrollees = async (list, existingPhoneNumbers) => {
  for (const enrollee of list) {
    if (!(enrollee.phone in existingPhoneNumbers)) {
      // Add as users and enrollees
      enrollee.username = enrollee.phone;
      enrollee.gender = genders.UNSPECIFIED;
      const password = generateRandomPassword();
      enrollee.password = await generatePassword(password);
      enrollee.stateId = parseInt(process.env.STATE_ID);
      enrollee.roles = JSON.stringify([roles.ENROLLEE.name]);

      const [id] = await db.insert(enrollee).into(USERS).returning('id');
      await registrationRepository.addEnrollee(enrollee, id);

      //       const message = `Dear ${enrollee.firstName}, an account was opened for you on ${APP_NAME} with the following details:
      // username: ${enrollee.phone}
      // password: ${password}

      // Please login and update your details. `

      // Send activation messages
      // TODO: Enable SMS delivery
      // smsService.sendActivationMessage(phone, activationCode);
    }
  }
};

const makePayment = async (
  paymentType,
  totalAmount,
  user,
  noOfAdoptees,
  lgaId,
) => {
  let paymentReference = '';
  let paymentLink = '';

  if (paymentType === paymentChannels.debit_card) {
    paymentReference = uuidV4();

    // Call flutterwave
    console.log('==============Calling Payment Service=================');
    const paymentData = {
      transactionId: paymentReference,
      amount: totalAmount,
      user: {
        email: user.email,
        phonenumber: user.phone,
        name: `${user.firstName} ${user.lastName}`,
      },
      metadata: {
        totalAmount,
        noOfAdoptees,
        lgaId,
      }, // Add extra info later,
    };

    // const { success,
    //   link } = await flutterwaveService.getPaymentLink(
    //   paymentData,
    // );
    const { success,
      link } = await paystackService.getPaymentLink(
      paymentData,
    );
    if (success) {
      paymentLink = link;
    }
    return {
      paymentReference,
      paymentLink,
      // TODO: This might need to be looked into later.
      status: 'success',
      gateway: 'paystack',
      channel: 'card',
      paymentDate: moment().format('YYYY-MM-DD hh:mm'),
    };
  } else {
    return {
      paymentReference,
      paymentDate: moment().format('YYYY-MM-DD hh:mm'),
    };
  }
};

const parseAdoptionFile = async (file) => {
  const filePath = `uploads/temp/${generateRandomNumber(4)}-${file.name}`;
  await file.mv(filePath);
  const excelFile = xlsx.readFile(filePath);
  const content = xlsx.utils.sheet_to_json(excelFile.Sheets[excelFile.SheetNames[0]]);
  unlinkSync(filePath);

  return content;
};

const addTempEnrollees = async (list) => {
  const [id] = await db
    .insert({
      enrollees: JSON.stringify(list),
    })
    .into(TEMP_ENROLLEES)
    .returning('id');
  return id;
};

const getExportFields = () => {
  return [
    { label: 'Date', value: 'createdAt' },
    { label: 'Adopter', value: 'user' },
    { label: 'LGA', value: 'lga' },
    { label: 'Category', value: 'category' },
    { label: 'Type', value: 'type' },
    { label: 'No of Adoptees', value: 'noOfAdoptees' },
    { label: 'Start Date', value: 'startDate' },
    { label: 'Total Amount', value: 'totalAmount' },
    { label: 'Duration Type', value: 'durationType' },
    { label: 'Payment status', value: 'paymentProcessed' },
    { label: 'No of Adoptees', value: 'noOfAdoptees' },
  ];
};
