import { StringUtils } from "../utils";

const stringUtils = new StringUtils();

export class SearchHeaderPage {
    public getFavoritesToggleBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getSearchHeader().find('.bt-favorites-mode-toggle');
    }

    public clickFavoritesToggleBtn(): void {
        this.getFavoritesToggleBtn().click({force: true});
    }

    public getFavoritesCountText(): Cypress.Chainable<string> {
        return this.getSearchHeader().find('.bt-favorites-link__count').invoke('text');
    }

    public getFavoritesCountRawNumber(): Cypress.Chainable<number> {
        return this.getFavoritesCountText().then(count => {
            return Number(stringUtils.removeAllNonNumericalCharacters(count));
        })
    }

    public getFavoritesLinkIcon(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getSearchHeader().find('.bt-favorites-link__icon');
    }

    private getSearchHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.bt-search__header');
    }
}
