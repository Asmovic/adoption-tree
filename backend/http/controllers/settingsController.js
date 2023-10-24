const db = require('../../lib/knexConnection');
const { APP_SETTINGS } = require('../../config/dbConfig').tableNames;
const { ErrorHandler } = require('../helpers/ErrorHandler');

exports.index = async (req, res, next) => {
  try {
    const settings = await db(APP_SETTINGS).orderBy('key', 'asc');

    return res.json({ data: settings });
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    const { key, value } = req.body;

    if (!(key || value)) {
      throw new ErrorHandler(400, [{ message: 'Both key and value must be specified' }]);
    }

    const checkKey = await db(APP_SETTINGS).where({ key }).first();

    if (checkKey) {
      throw new ErrorHandler(400, [{ message: 'Key already exists' }]);
    }

    await db(APP_SETTINGS).insert({ key, value });

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    const { id } = req.params;

    if (!(key || value)) {
      throw new ErrorHandler(400, [{ message: 'Both key and value must be specified' }]);
    }

    const checkSetting = await db(APP_SETTINGS).where({ id }).first();

    if (!checkSetting) {
      throw new ErrorHandler(400, [{ message: 'Settings not found' }]);
    }

    const checkKey = await db(APP_SETTINGS)
      .where({ key })
      .andWhere('id', '<>', id)
      .first();

    if (checkKey) {
      throw new ErrorHandler(400, [{ message: 'Key already exists' }]);
    }

    await db(APP_SETTINGS)
      .where({ id })
      .update({ key, value });

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
