import { StringUtils } from "../utils";

const stringUtils = new StringUtils();

export interface TileDetails {
	propertyName: string;
	propertyInfo: string;
}

export class ResultListPage {
	public getAllDisplayedPropertyTiles(): Cypress.Chainable<JQuery<HTMLElement>> {
		return this.getResultList().find('.bt-teaser');
	}

	public getPropertyTileByIndex(index:number): Cypress.Chainable<JQuery<HTMLElement>> {
		return this.getAllDisplayedPropertyTiles().eq(index);
	}

	public getFavoriteBtnOfSpecificPropertyTile(tile: Cypress.Chainable<JQuery<HTMLElement>>): Cypress.Chainable<JQuery<HTMLElement>> {
		return tile.find('[type="button"][class*="bt-favorite"]');
	}

	public clickFavoriteBtnOfSpecificPropertyTile(tile: Cypress.Chainable<JQuery<HTMLElement>>): Cypress.Chainable<JQuery<HTMLElement>> {
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

	public getDetailsOfSpecificPropertyTile(tile: JQuery<HTMLElement>): Cypress.Chainable<TileDetails> {
		return cy.wrap(tile.find('.bt-teaser__link')).invoke('text').then(propertyName => {
			return cy.wrap(tile.find('.bt-teaser__info')).invoke('text').then(propertyInfo => {
				const details: TileDetails = {
					propertyName,
					propertyInfo,
				}

				return details;
			});
		});
	}

	private getResultCountText(): Cypress.Chainable<string> {
		return cy.get('.bt-result-count').invoke('text');
	}

	private getResultList(): Cypress.Chainable<JQuery<HTMLElement>> {
		return cy.get('.bt-results-list', { timeout: 10000 });
	}
}
