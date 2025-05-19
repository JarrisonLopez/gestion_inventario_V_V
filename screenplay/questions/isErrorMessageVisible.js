class IsErrorMessageVisible {
    async answeredBy(actor) {
        const page = actor.page;
        return await page.get('.swal2-title').contains('Error');
    }
}

module.exports = IsErrorMessageVisible;