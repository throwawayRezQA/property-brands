import { ErrorMessagesConstants } from "../support/constants";
import { CookieBannerPage, FiltersModalPage, ResultListPage, SearchHeaderPage, TileDetails } from "../support/page-objects";

const cookieBannerPage = new CookieBannerPage();
const filtersModalPage = new FiltersModalPage();
const resultListPage = new ResultListPage();
const searchHeaderPage = new SearchHeaderPage();

interface Property {
  baths: number;
  beds: number;
  halfBaths: number;
  name: string;
  maximumPeopleSleeping: number;
}

describe('Tests related to filtering the result list', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    cy.intercept('**/graphql?query=query%28%24channels%3AChannelFilter%21%2C%24*').as('filterRequest');
    cy.logIn();
    cy.wait('@filterRequest').then(request => {
      const rawPropertiesData: any[] = request.response?.body.data.lodgingProducts.results;
      const propertiesDataEsentialForTesting: Property[] = [];

      rawPropertiesData.forEach(property => {
        const currentPropertyData: Property = {
          baths: property.baths,
          beds: property.beds,
          halfBaths: property.halfBaths,
          name: property.item.name,
          maximumPeopleSleeping: property.occ_total,
        }

        propertiesDataEsentialForTesting.push(currentPropertyData);
      });
      cy.wrap(propertiesDataEsentialForTesting).as('allProperties');
    });
    cookieBannerPage.clickAcceptCookiesBtn();
  });

  const setBedroomsFilterToSpecificValue = (value: number): void => {
    for (let i = 0; i < value; i++) {
      filtersModalPage.clickIncreaseMinimumBedroomsBtn();
    }
  }

  const openAndClearFilters = (): void => {
    searchHeaderPage.clickFiltersBtn();
    filtersModalPage.clickClearFiltersBtn();
  }

  const clickViewResultsAndMakeSureResultsAreLoaded = (): void => {
    filtersModalPage.clickViewResultsBtn();
    resultListPage.waitUntilSomeResultsAreLoaded();
  }

  const getUIresultCountAndVerifyItIsEqualTo = (correctResultAmount: number): void => {
    resultListPage.getResultCountRawNumber().then(originalResultCount => {
      expect(originalResultCount).to.eq(correctResultAmount);
    });
  }

  it('[FILTER-01]: Filter section allows the user to select the minimum number of bedrooms. The result list is correctly filtered by the minimum value', () => {
    cy.get('@allProperties').then(dataForFiltering => {
      const allProperties: Property[] = dataForFiltering as unknown as Property[];
      const beds: number[] = [];
      allProperties.forEach(property => {
        if(property.beds !== undefined) {
          beds.push(property.beds);
        }
      });
      const uniqueBedAmounts = [...new Set(beds)];
      const lowestBedAmountOfAllResults = Math.min(...uniqueBedAmounts);
      const highestBedAmountOfAllResults = Math.max(...uniqueBedAmounts);

      openAndClearFilters();
      setBedroomsFilterToSpecificValue(lowestBedAmountOfAllResults);
      clickViewResultsAndMakeSureResultsAreLoaded();
      getUIresultCountAndVerifyItIsEqualTo(allProperties.length);

      openAndClearFilters();
      setBedroomsFilterToSpecificValue(lowestBedAmountOfAllResults + 1);
      clickViewResultsAndMakeSureResultsAreLoaded();
      const propertiesHavingMoreBedsThanMin: Property[] = allProperties.filter(properties => properties.beds > lowestBedAmountOfAllResults);   
      getUIresultCountAndVerifyItIsEqualTo(propertiesHavingMoreBedsThanMin.length);

      openAndClearFilters();
      setBedroomsFilterToSpecificValue(highestBedAmountOfAllResults);
      clickViewResultsAndMakeSureResultsAreLoaded();
      const propertiesHavingTheHighestAmountOfBeds: Property[] = allProperties.filter(properties => properties.beds === highestBedAmountOfAllResults);
      getUIresultCountAndVerifyItIsEqualTo(propertiesHavingTheHighestAmountOfBeds.length);

      openAndClearFilters();
      setBedroomsFilterToSpecificValue(highestBedAmountOfAllResults + 1);
      filtersModalPage.clickViewResultsBtn();
      resultListPage.getLackOfResultList().should('be.visible').and('contain', ErrorMessagesConstants.EMPTY_FILTER_RESULTS_ERROR_MSG);
    });
  });
});

/**
 * As a user I want the ability to filter properties based on the number of bedrooms and bathrooms.

Acceptance Criteria:

The Filters selection should allow the user to select the number of either bedrooms and/or bathrooms.
The selection should limit the value to an integer with a lower value of 0 (zero).
The Clear Filters button should reset both filters to their lower value.
The View Results button should close the Filter Results page and display properties on the hub meeting the criteria.
 */

