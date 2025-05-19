class EnterCredentials {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async performAs(actor) {
        const page = actor.page;
        await page.get('#username').type(this.username);
        await page.get('#password').type(this.password);
    }
}

module.exports = EnterCredentials;

