const httpClient = require('../../infrastructure/httpClient/axios')

class ProjectService {

    async getProjects() {
        try {
            const response = await httpClient.get('/rest/api/3/project')
            const projectsFormatted = this.handleJiraProjects(response.data)
            return projectsFormatted
        } catch (err) {
            console.log(err.message)
        }
    }

    async getSoftwareProjectsEpics(startAt=0) {
        const softwareProjects= await this.getProjects()
        const softwareProjectsKeys = softwareProjects.map((project) => {
            return project.key
        })

        var startAt = 0
        const jiraMaxResults = 100
        let runOneMoreTime = true
        const projectEpics = { issues: [] }
        
        let jql = `project in ('${softwareProjectsKeys.join("','")}') AND issuetype = Epic and statusCategory != Done`
              
        
        while (runOneMoreTime) {
            let url = `/rest/api/2/search?jql=${jql}&fields=parent,key,summary&startAt=${startAt}&maxResults=100`  
            const jiraSearchResult = await httpClient.get(url)

            const { total, issues } = jiraSearchResult.data
            projectEpics.issues = projectEpics.issues.concat(issues)

            startAt += jiraMaxResults
            runOneMoreTime = total - startAt > 0
        }
        
        
        return projectEpics
    }

    handleJiraProjects(jiraProjects) {
        const jiraSoftwareProjects = jiraProjects.filter(
          (project) => {
            return project.projectTypeKey === 'software' && project.archived !== true
          }
        )
    
        const handledJiraProjects = jiraSoftwareProjects.map(
          (softwareProject) => {
            return {
              key: softwareProject.key,
              name: softwareProject.name,
            }
          }
        )
    
        return handledJiraProjects
      }
}

const projectService = new ProjectService()

module.exports = projectService