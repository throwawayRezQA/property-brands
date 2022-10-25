import { ResultListPage } from "../support/page-objects";

const resultListPage = new ResultListPage();

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
});
