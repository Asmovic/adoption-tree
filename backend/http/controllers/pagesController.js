const sass = require('node-sass');
const moment = require('moment');
const { promisify } = require('util');
const slugify = require('slugify').default;
const renderAsync = promisify(sass.render);
const db = require('../../lib/knexConnection');
const { setPaginateOptions } = db;
const { PAGES } = require('../../config/dbConfig').tableNames;
const { validateCreate, validateUpdate } = require('../../schemas/pages/pageSchema');

exports.getPageBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const page = await db.select().from(PAGES).where({ slug }).first();
    console.log('slug: ', slug);
    if (!page) {
      return res.status(404).json({
        errors: [
          { message: 'Page not found' },
        ],
      });
    }
    const { styles, content } = page;
    let compiledStyles = '';
    if (styles) {
      compiledStyles = (await renderAsync({ data: styles })).css.toString();
    }
    return res.json({
      data: {
        styles: compiledStyles,
        content,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getPageById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const page = await db.select().from(PAGES).where({ id }).first();
    if (!page) {
      return res.status(404).json({
        errors: [
          { message: 'Page not found' },
        ],
      });
    }

    return res.json({
      data: page,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    const { data, pagination } = await db.select(['id', 'slug', 'title', 'createdAt', 'updatedAt'])
      .from(PAGES).paginate(setPaginateOptions(req.query));
    return res.json({ data, pagination });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    const { isValid, body } = await validateCreate(req.body);
    if (!isValid) {
      //
    } // Do something

    let {
      title, slug, content, styles,
    } = body;

    if (!slug) {
      slug = slugify(title, { lower: true, remove: "'" });
    }

    const exists = await db.select().from(PAGES).where({ slug }).first();
    if (exists) {
      slug = slug + '-' + moment().format('YYYY-MM-DD_HH_mm_ss');
    }

    const [post] = await db.insert({ title, slug, content, styles }).into(PAGES).returning('*');

    return res.json({ success: true, data: post });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { isValid, body } = await validateUpdate(req.body);
    if (!isValid) {
      //
    } // Do something

    let {
      title, slug, content, styles,
    } = body;

    if (!slug) {
      slug = slugify(title, { lower: true, remove: "'" });
    }

    const page = await db.select().from(PAGES).where({ id }).first();
    if (!page) {
      return res.status(404).json({
        errors: [
          { message: 'Page not found' },
        ],
      });
    }

    const updatedPage = Object.assign(page, { title, slug, content, styles });

    const [post] = await db
      .table(PAGES)
      .update(updatedPage)
      .where({ id })
      .returning('*');

    return res.json({ success: true, data: post });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
