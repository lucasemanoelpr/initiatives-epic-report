const projectService = require("../../shared/services/projectService")

class LpmEpicsReportService {
    constructor(projectService) {
        this.projectService = projectService
    }

    async generateLpmEpicsReport() {
        var lpmReportObject = await this.projectService.getProjects()
        const softwareProjectsEpics = await this.projectService.getSoftwareProjectsEpics()

        softwareProjectsEpics.issues.map((issue) => {
            let key = issue.key.split('-')[0]
            const indexProject = lpmReportObject.findIndex(obj => obj.key === key)
            lpmReportObject = this.populateLpmReportObject(lpmReportObject, issue, indexProject)
        })

        lpmReportObject = this.addLinkedToInitiativeInfo(lpmReportObject)

        return lpmReportObject
    }

    populateLpmReportObject(object, issue, index) {
        if (object[index].issues == undefined) {
            object[index].issues = []
        }
        object[index].issues.push(issue)
        return object
    }

    addLinkedToInitiativeInfo(lpmReportObject) {
        /*
            * 1. Percorrer as issues por projeto
            * 2. Estiver issues com parent LPM e issues sem parent LPM
            * 3. Salvar esta info na raiz do objeto projeto como 
            * lpmInfo: { issuesWithoutInitiative: x, issuesWithInitiative: x, percentageWithInitiative: x% }
        */
        lpmReportObject.map((obj, index) => {
            if (obj.issues == undefined) {
                obj.lpmInfo = {
                    issuesWithoutInitiative: 0,
                    issuesWithInitiative: 0,
                    percentageWithInitiative: 0
                }
                return
            }
            try {
                const totalIssues = obj.issues != undefined ? obj.issues.length : 0
                var issuesWithInitiative = 0
                obj.issues.map(issue => {
                    issuesWithInitiative = issue.fields.parent != undefined ? issuesWithInitiative + 1 : issuesWithInitiative
                })
                obj.lpmInfo = {
                    issuesWithoutInitiative: totalIssues - issuesWithInitiative,
                    issuesWithInitiative,
                    percentageWithInitiative: (issuesWithInitiative / totalIssues) * 100
                }
            } catch (err) {
                console.log(obj)
            }
            
        })

        return lpmReportObject
    }
}

const lpmEpicsReportService = new LpmEpicsReportService(projectService)
module.exports = lpmEpicsReportService