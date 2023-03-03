require('dotenv').config()
const express = require("express");
const lpmEpicsReportService = require('./domain/lpm/lpmEpicsReportService');
const projectService = require("./shared/services/projectService");


const app = express()

app.get('/projects', async (req, res) => {
  const projects = await projectService.getProjects()
  res.send(projects)
})

app.get('/epics-lpm-report', async (req, res) => {
  const epicLpmReport = await lpmEpicsReportService.generateLpmEpicsReport()
  res.send(epicLpmReport)
})

module.exports = app