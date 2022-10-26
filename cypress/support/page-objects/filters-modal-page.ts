export class FiltersModalPage {
    public clickIncreaseMinimumBedroomsBtn(): void {
        this.getIncreaseMinimumBedroomsBtn().click();
    }

    public clickDecreaseMinimumBedroomsBtn(): void {
        this.getDecreaseMinimumBedroomsBtn().click();
    }

    public clickViewResultsBtn(): void {
        this.getViewResultsBtn().click();
    }

    public clickClearFiltersBtn(): void {
        this.getClearFiltersBtn().click();
    }

    public getCurrentValueOfMinimumBedroomsFilter(): Cypress.Chainable<number> {
        return this.getMinimumBedroomsSection().find('.bt-range-filter__value').invoke('text').then(value => {
            return Number(value);
        });
    }

    public getFiltersModal(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.ReactModal__Content--after-open');
    }

    private getIncreaseMinimumBedroomsBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getMinimumBedroomsSection().find('.bt-range-filter__button--plus');
    }

    private getDecreaseMinimumBedroomsBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return this.getMinimumBedroomsSection().find('.bt-range-filter__button--minus');
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
