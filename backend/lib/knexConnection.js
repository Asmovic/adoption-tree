const knexFile = require('./../knexfile');
const env = process.env.NODE_ENV || 'development';
let config = knexFile[env];
if (!config) config = knexFile.development;
const knex = require('knex');
const { attachPaginate } = require('knex-paginate');
attachPaginate();
const moment = require('moment');

const setPaginateOptions = (query, options = {}) => {
  const page = query.page || 1;
  const perPage = query.per_page || 10;
  return Object.assign(
    query,
    {
      perPage: parseInt(perPage),
      currentPage: page,
      isLengthAware: true,
      isFromStart: false,
    },
    options,
  );
};

knex.QueryBuilder.extend('dateFilter', function (dateColumn, startDate, endDate) {
  if (startDate) {
    this.where(dateColumn, '>=', startDate);
  }

  if (endDate) {
    this.where(dateColumn, '<=', moment(endDate).endOf('day'));
  }

  return this;
});

module.exports = knex(config);
module.exports.setPaginateOptions = setPaginateOptions;
