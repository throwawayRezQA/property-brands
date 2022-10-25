import { ResultListPage, SearchHeaderPage } from "../support/page-objects";

const resultListPage = new ResultListPage();
const searchHeaderPage = new SearchHeaderPage();

describe('Tests related to the favorite functionality', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    cy.logIn();
  });

  it('[FAV-01]: Each property tile contains a Favorite on/off button which is OFF by default', () => {
    resultListPage.getAllDisplayedPropertyTiles().each((tile) => {
      resultListPage.getFavoriteBtnOfSpecificPropertyTile(tile).then(btn => {
        expect(btn.length).to.eq(1);
        expect(btn).to.be.visible;
        cy.wrap(btn).should('have.attr', 'aria-checked').and('equal', 'false');
      });
    });
  });

  it('[FAV-02]: Hub contains a proper indicator of the number of favorited properties and is set to 0 by default', () => {
    searchHeaderPage.getFavoritesLinkIcon().should('be.visible').and('have.css', 'fill', 'rgb(255, 83, 83)');
    
    searchHeaderPage.getFavoritesCountRawNumber().then(defaultFavoriteCount => expect(defaultFavoriteCount).to.eq(0));
  });
});
