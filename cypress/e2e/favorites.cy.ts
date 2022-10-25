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

  it('[FAV-03]: Clicking the heart icon on the property tile correctly ticks the icon', () => {
    resultListPage.getAllDisplayedPropertyTiles().then(tiles => {
      const testedTile = tiles.eq(0);
      resultListPage.clickFavoriteBtnOfSpecificPropertyTile(testedTile);

      resultListPage.getFavoriteBtnOfSpecificPropertyTile(testedTile).then(btn => {
        expect(btn.length).to.eq(1);
        expect(btn).to.be.visible;
        cy.wrap(btn).should('have.attr', 'aria-checked').and('equal', 'true');
      });
    });
  });

  it('[FAV-04]: Ticking/unticking properties as favorites properly increases/decreases the favorite counter', () => {
    const verifyFavoriteCounterIncrementsProperly = (currentFavoritedAmount: number, propertyTilesToTickAsFavorite: JQuery<HTMLElement>) => {
      for (let i = 0 ; i < propertyTilesToTickAsFavorite.length ; i++) {
        resultListPage.clickFavoriteBtnOfSpecificPropertyTile(propertyTilesToTickAsFavorite.eq(i)).then(() => {
          currentFavoritedAmount++;
          searchHeaderPage.getFavoritesCountRawNumber().then(uiFavoritedCounter => {
            expect(uiFavoritedCounter).to.eq(currentFavoritedAmount);
          });
        });
      }
    }
  
    const verifyFavoriteCounterDecrementsProperly = (currentFavoritedAmount: number, propertyTilesToUntickAsFavorite: JQuery<HTMLElement>) => {
      for (let i = 0 ; i < propertyTilesToUntickAsFavorite.length ; i++) {
        resultListPage.clickFavoriteBtnOfSpecificPropertyTile(propertyTilesToUntickAsFavorite.eq(i)).then(() => {
          currentFavoritedAmount--;
          searchHeaderPage.getFavoritesCountRawNumber().then(uiFavoritedCounter => {
            expect(uiFavoritedCounter).to.eq(currentFavoritedAmount);
          });
        });
      }
    }

    const initialFavoritedCount = 0;
    resultListPage.getAllDisplayedPropertyTiles().then((tiles) => {
      if(tiles.length === 0) {
        throw new Error('There are no tiles displayed in the UI!');
      }

      const testedTiles = tiles.slice(0, 10); // only checking up to 10 tiles.

      verifyFavoriteCounterIncrementsProperly(initialFavoritedCount, testedTiles);
      verifyFavoriteCounterDecrementsProperly(testedTiles.length, testedTiles);
    });
  });
});
