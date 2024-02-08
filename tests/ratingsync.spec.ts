import { test, expect } from '@playwright/test';
import { fail } from 'assert';
test.describe.configure({ mode: 'serial' });
test.describe('Average Rating sync with Home page and review page', () => {
    const appUrl="https://movie-reviews-psi.vercel.app/"
    const newMovieName="Titanic"  //enter the name of the new movie here
    const newMovieDate="2024-02-04"   //enter the release date of the new movie here
    const yourName="tester"
    const rating="7"
    const review="Excellent"
    const sampleMovie="testing"
    const editMovie="edited"
    const deleteMovie=editMovie
    const staticMovie="do not delete"
    const editMovieDate="2024-02-08"
    test.beforeEach(async ({ page }) => {
        // Go to https://movie-reviews-psi.vercel.app/
        await page.goto(appUrl,{waitUntil: 'networkidle'});
        await expect(page).toHaveURL(appUrl);
    });
  
    test('Verify that rating on the movie card in home page matches with the average rating for that movie in the review page', async ({ page }) => {
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(staticMovie);
      await page.waitForTimeout(4000);
      let ratingPoint=await page.locator('xpath=//footer//p[@class="font-bold"]').innerText()
      let displayedRating=parseFloat(ratingPoint.split('Rating: ')[1])
      console.log(displayedRating,typeof(displayedRating))
      await page.locator(`xpath=//h1[contains(text(),"${staticMovie}")]`).click();
      await page.waitForTimeout(3000);
      let averageRatingReviewPage= await page.locator('xpath=//div[@class="my-8 flex justify-between"]//p').innerText();
      let displayedAverageRating= parseFloat(averageRatingReviewPage.split('/')[0]);
      console.log(displayedAverageRating,typeof(displayedAverageRating))
      test.fail(displayedRating!=displayedAverageRating,"Ratings doesn't match") 
    });
  });
  