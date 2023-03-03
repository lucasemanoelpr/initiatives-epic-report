require('dotenv').config()
const express = require("express")
const nunjucks = require('nunjucks')
const lpmEpicsReportService = require('./domain/lpm/lpmEpicsReportService')

const app = express()

nunjucks.configure(__dirname + '/views', {
  autoescape: true,
  express: app
});

app.get('/epics-lpm-report', async (req, res) => {
  const epicLpmReport = await lpmEpicsReportService.generateLpmEpicsReport()
  res.render('lpmReports/index.njk', { projectsLpmInfo: epicLpmReport })
})

module.exports = app