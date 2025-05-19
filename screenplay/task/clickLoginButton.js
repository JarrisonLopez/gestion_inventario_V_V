class ClickLoginButton {
    async performAs(actor) {
        const page = actor.page;
        await page.get('button[type="submit"]').click();
    }
}

module.exports = ClickLoginButton;