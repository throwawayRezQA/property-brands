export class FiltersModalPage {
    public getIncreaseMinimumBedroomsBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getMinimumBedroomsSection().find('.bt-range-filter__button--plus');
    }

    public clickIncreaseMinimumBedroomsBtn(): void {
        this.getIncreaseMinimumBedroomsBtn().click();
    }

    public clickViewResultsBtn(): void {
        this.getViewResultsBtn().click();
    }

    public clickClearFiltersBtn(): void {
        this.getClearFiltersBtn().click();
    }

    private getMinimumBedroomsSection(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('#bt-range-label--Minimum-Bedrooms').parent('.bt-range-filter__input-wrapper');
    }

    private getViewResultsBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.bt-modal-toggle--close');
    }

    private getClearFiltersBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.bt-clear-filters');
    }
}
