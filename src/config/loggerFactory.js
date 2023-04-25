class loggerFactory {
    constructor(fileName) {
        this.fileName = fileName
    }
    log({ error = null, message = null, method = null, patchId = null, caseId = null}) {
        return `${JSON.stringify(error)} | ${message} | ${method} | ${patchId} | ${caseId} | ${this.fileName}`
    }
}

module.exports = loggerFactory;