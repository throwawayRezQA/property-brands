export class ResultListPage {
    public getAllDisplayedPropertyTiles(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getResultList().find('.bt-teaser');
    }

    public getFavoriteBtnOfSpecificPropertyTile(tile: JQuery<HTMLElement>): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.wrap(tile.find('[type="button"][class*="bt-favorite"]'));
    }

    public clickFavoriteBtnOfSpecificPropertyTile(tile: JQuery<HTMLElement>): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getFavoriteBtnOfSpecificPropertyTile(tile).click();
    }

    private getResultList(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.bt-results-list');
    }
}
