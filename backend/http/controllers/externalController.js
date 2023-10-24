const db = require('../../lib/knexConnection');
const { ENROLLEES, VW_ENROLLEES } = require('../../config/dbConfig').tableNames;

exports.updateBiometric = async (req, res, next) => {
  try {
    const {
      phone, is_image_capured: isImageCaptured, passport, signature,
    } = req.body.message;

    const enrollee = await db(VW_ENROLLEES)
      .where({ phone })
      .first();

    if (!enrollee) {
      return res.status(404).json({ message: 'Enrollee not found ' });
    }

    await db(ENROLLEES)
      .where({ id: enrollee.enrolleeId })
      .update({
        hasBiometric: true,
        isImageCaptured,
        passport,
        signature,
      });

    return res.json();
  } catch (error) {
    next(error);
  }
};
