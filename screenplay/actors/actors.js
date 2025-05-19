class Actor {
    constructor(name, page) {
        this.name = name;
        this.page = page; // Página de Cypress
    }

    async attemptsTo(task) {
        await task.performAs(this);
    }

    async asks(question) {
        return await question.answeredBy(this);
    }
}

module.exports = Actor;