const express = require('express');
const cors = require('cors');
const conn = require('./db/conn');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const { default: mongoose } = require('mongoose');
const apiRouter = require('./routes/router');

const app = express();

conn();

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
});

const adminRouter = AdminBroExpress.buildRouter(adminBro);

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use(adminBro.options.rootPath, adminRouter);

module.exports = app;