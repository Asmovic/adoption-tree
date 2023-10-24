const JoiBase = require('joi');
const JoiDate = require('@hapi/joi-date');
const genders = require('../../constants/genders');
const roles = require('../../constants/roles');

const Joi = JoiBase.extend(JoiDate);

module.exports = Joi.object({
  firstName: Joi.string().min(2).required().max(50),
  lastName: Joi.string().min(2).required().max(50),
  middleName: Joi.string().min(2).max(50),
  gender: Joi.string()
    .min(2)
    .required()
    .max(50)
    .valid(...Object.keys(genders).map((key) => genders[key])),
  username: Joi.string().min(2).required().max(50).alphanum(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string()
    .min(6)
    .required()
    .pattern(new RegExp(/^\+?([0-9]{6,15})$/)),
  password: Joi.string().max(50).required(),
  confirmPassword: Joi.ref('password'),
  birthDate: Joi.date()
    .format(['YYYY/MM/DD', 'YYYY-MM-DD'])
    .raw()
    .optional(),
  role: Joi.string()
    .required()
    .valid(...Object.keys(roles)),
  address: Joi.string().min(2).max(255),
  nationality: Joi.string().max(255),
  stateId: Joi.number(),
  lgaId: Joi.number(),
  hospital: Joi.any().when('role', {
    is: roles.ENROLLEE.name,
    then: Joi.string().max(255),
  }),
  genotype: Joi.any().when('role', {
    is: roles.ENROLLEE.name,
    then: Joi.number(),
  }),
  biometricId: Joi.any().when('role', {
    is: roles.ENROLLEE.name,
    then: Joi.string().max(50),
  }),
  religion: Joi.any().when('role', {
    is: roles.ENROLLEE.name,
    then: Joi.number(),
  }),
  bloodGroup: Joi.any().when('role', {
    is: roles.ENROLLEE.name,
    then: Joi.number(),
  }),
  nok: Joi.any().when('role', {
    is: roles.ENROLLEE.name,
    then: Joi.string().max(50),
  }),
  nokPhone: Joi.any().when('role', {
    is: roles.ENROLLEE.name,
    then: Joi.string().max(15),
  }),
  nokAddress: Joi.any().when('role', {
    is: roles.ENROLLEE.name,
    then: Joi.string().max(255),
  }),
  nokRelationship: Joi.any().when('role', {
    is: roles.ENROLLEE.name,
    then: Joi.number(),
  }),
  residentAddress: Joi.any().when('role', {
    is: roles.DONOR.name,
    then: Joi.string().min(5).max(255),
  }),
  residentStateId: Joi.any().when('role', {
    is: roles.DONOR.name,
    then: Joi.number(),
  }),
  residentLgaId: Joi.any().when('role', {
    is: roles.DONOR.name,
    then: Joi.number(),
  }),
})
  .with('password', 'confirmPassword')
  .options({ abortEarly: false, allowUnknown: true });
