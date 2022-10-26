export class CookieBannerPage {
    public clickAcceptCookiesBtn(): void {
        this.getAcceptCookiesBtn().click();
    }

    private getAcceptCookiesBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.sqs-cookie-banner-v2-accept');
    }
}
