import { StringUtils } from "../utils";

const stringUtils = new StringUtils();

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

    public getResultCountRawNumber(): Cypress.Chainable<number> {
        return this.getResultCountText().then(count => {
            return Number(stringUtils.removeAllNonNumericalCharacters(count));
        });
    }

    public getLackOfResultList(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.bt-no-results');
    }

    public waitUntilSomeResultsAreLoaded(): void {
        this.getAllDisplayedPropertyTiles().then(tiles => expect(tiles.length).to.be.gte(1));
    }

    private getResultCountText(): Cypress.Chainable<string> {
        return cy.get('.bt-result-count').invoke('text');
    }

    private getResultList(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.bt-results-list');
    }
}
