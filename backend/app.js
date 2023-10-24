var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const dotEnv = require('dotenv');
const cron = require('node-cron');

// Set environment variables
dotEnv.config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('trust proxy', true);

app.use(logger('dev'));
app.use(fileUpload());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS (during development)
if (app.get('env') === 'development') {
  var whitelist = ['http://localhost'];
  var corsOptionsDelegate = function (req, callback) {
    const origin = req.header('Origin');
    var corsOptions = {
      // disable CORS for this request by default
      origin: false,
    };
    if (origin && whitelist.find((x) => origin.match(x))) {
      corsOptions = {
        origin: origin,
        credentials: true,
        exposedHeaders: ['X-Refresh-Token', 'X-Access-Token', 'X-Kill-Session'],
      }; // reflect (enable) the requested origin in the CORS response
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
  };

  app.use(cors(corsOptionsDelegate));
  app.options('*', cors(corsOptionsDelegate));
}
// else {
//   const whitelist = ['https://www.anshia.com.ng', 'https://anshia.com.ng', 'https://staging.anshia.com.ng'];
//   const corsOptions = {
//     origin: function (origin, callback) {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//   };
//   app.use(cors(corsOptions));
// }

// Run startup operations.
const startup = require('./startup');
startup.forEach((fn) => fn());

// Run middlewares
app.use(require('./middlewares'));

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  req.logger.error(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const enableCron = process.env.ENABLE_CRON || true;
const cronInterval = process.env.SYNC_CRON_INTERVAL || 3; // Minutes
const cronExpression = `*/${cronInterval} * * * *`;

if (JSON.parse(enableCron)) { // convert string value to boolean
  cron.schedule(cronExpression, () => {
    require('./sheduledTasks/adoptionTask').run();
    require('./sheduledTasks/syncEnrolleesTask').run();
    require('./sheduledTasks/syncDonorsTask').run();
    require('./sheduledTasks/syncPaymentTask').run();
  });

  cron.schedule('0 2 * * *', () => {
    require('./sheduledTasks/seedHospitalsTask').run();
  });
}

module.exports = app;
