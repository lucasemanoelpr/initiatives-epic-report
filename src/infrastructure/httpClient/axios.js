const { default: axios } = require("axios");

const api = axios.create({
    baseURL: process.env.SOURCE_PROJECTS_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    auth: {
        username: process.env.JIRA_EMAIL,
        password: process.env.AUTH_TOKEN
    },
    
})

module.exports = api