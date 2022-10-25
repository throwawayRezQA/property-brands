import { ErrorMessagesConstants } from "../support/constants";
import { ResultListPage, SearchHeaderPage, TileDetails } from "../support/page-objects";

const resultListPage = new ResultListPage();
const searchHeaderPage = new SearchHeaderPage();

describe('Tests related to the favorite functionality', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    cy.logIn();
    resultListPage.waitUntilSomeResultsAreLoaded();
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
      for (let i = 0; i < propertyTilesToTickAsFavorite.length; i++) {
        resultListPage.clickFavoriteBtnOfSpecificPropertyTile(propertyTilesToTickAsFavorite.eq(i)).then(() => {
          currentFavoritedAmount++;
          searchHeaderPage.getFavoritesCountRawNumber().then(uiFavoritedCounter => {
            expect(uiFavoritedCounter).to.eq(currentFavoritedAmount);
          });
        });
      }
    }

    const verifyFavoriteCounterDecrementsProperly = (currentFavoritedAmount: number, propertyTilesToUntickAsFavorite: JQuery<HTMLElement>) => {
      for (let i = 0; i < propertyTilesToUntickAsFavorite.length; i++) {
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
      const testedTiles = tiles.slice(0, 10); // only checking up to 10 tiles.

      verifyFavoriteCounterIncrementsProperly(initialFavoritedCount, testedTiles);
      verifyFavoriteCounterDecrementsProperly(testedTiles.length, testedTiles);
    });
  });

  it('[FAV-05]: Clicking on the favorite indicator button when there are no favorited properties displays a specific message', () => {
    searchHeaderPage.clickFavoritesToggleBtn();
    resultListPage.getResultCountRawNumber().then(resultCount => expect(resultCount).to.eq(0));
    resultListPage.getLackOfResultList().should('be.visible')
      .and('contain', ErrorMessagesConstants.EMPTY_FAVORITES_ERROR_MSG_1)
      .and('contain', ErrorMessagesConstants.EMPTY_FAVORITES_ERROR_MSG_2);
  });

  it('[FAV-06]: Clicking on the favorite indicator only displays the favorited properties', () => {
    const numberOfTilesToFavorite = 2; 
    
    resultListPage.getAllDisplayedPropertyTiles().then((tiles) => {
      if (tiles.length <= numberOfTilesToFavorite + 1) { // at least three tiles needed. Two will be marked as favorites and one will remain as not favorite
        throw new Error('There are too few available records to execute this test fully!')
      }
      const tilesToMarkAsFavorite = tiles.slice(0, numberOfTilesToFavorite);
      
      const tileDetailsBeforeFavoriting: TileDetails[] = [];
      for(let i = 0 ; i < tilesToMarkAsFavorite.length ; i ++) {
        const currentTile = tilesToMarkAsFavorite.eq(i);
        resultListPage.getDetailsOfSpecificPropertyTile(currentTile).then(details => {
          tileDetailsBeforeFavoriting.push(details);
          resultListPage.clickFavoriteBtnOfSpecificPropertyTile(currentTile);
          cy.wrap(tileDetailsBeforeFavoriting).as('tilesWhichShouldBeDisplayedInFavoritedView');
        });
      }

      searchHeaderPage.clickFavoritesToggleBtn();
      resultListPage.waitUntilSomeResultsAreLoaded();
      resultListPage.getResultCountRawNumber().then(numberOfTilesDisplayedInFavoritedView => expect(numberOfTilesDisplayedInFavoritedView).to.eq(numberOfTilesToFavorite));

      resultListPage.getAllDisplayedPropertyTiles().then((favoritedTiles) => {
        const tileDetailsAfterFavoriting: TileDetails[] = [];
        for(let i = 0 ; i < favoritedTiles.length ; i ++) {
          const currentTile = favoritedTiles.eq(i);
          resultListPage.getDetailsOfSpecificPropertyTile(currentTile).then(details => {
            tileDetailsAfterFavoriting.push(details);
            cy.wrap(tileDetailsAfterFavoriting).as('tilesWhichAreDisplayedInFavoritedView');
          })
        }
      });

      cy.get('@tilesWhichShouldBeDisplayedInFavoritedView').then(tilesWhichShouldBeDisplayedInFavoritedView => {
        cy.get('@tilesWhichAreDisplayedInFavoritedView').then(tilesWhichAreDisplayedInFavoritedView => {
          expect(tilesWhichAreDisplayedInFavoritedView).to.deep.eq(tilesWhichShouldBeDisplayedInFavoritedView);
        })
      })
    });
  });
});
