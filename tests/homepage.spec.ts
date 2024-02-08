import { test, expect } from '@playwright/test';
import { fail } from 'assert';
test.describe.configure({ mode: 'serial' });

test.describe('Home Page test cases', () => {
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
    
    test('Verify that the "Home Page" loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle("Movie Reviews");
    });

    test('Verify that the navigation bar is displayed correctly with 2 buttons- "Add new movie" and "Add new review"', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Add new movie' })).toBeVisible({timeout:1500});
      await expect(page.getByRole('button', { name: 'Add new review' })).toBeVisible({timeout:1500});
    });

    test('Verify that search box functionality works for both positive and negative keywords', async ({ page }) => {
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(sampleMovie);
      await page.waitForTimeout(4000);
      await expect(page.locator(`xpath=//h1[contains(text(),"${sampleMovie}")]`)).toBeVisible();
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill('      ');
      await page.waitForTimeout(4000);
      await expect(page.locator(`xpath=//h1[contains(text(),"falseeeeeeeee")]`)).not.toBeVisible();
    });

    test('Verify that "Add new movie" functionality adds a movie in the Movie List', async ({ page }) => {
      await page.getByRole('button', { name: 'Add new movie' }).click();
      await page.waitForTimeout(2000) //waiting for the modal to be rendered
      await expect(page.locator('h2')).toHaveText("Add new movie"); //checking the add new movie title in the modal
      await expect(page.getByPlaceholder('Name')).toBeVisible(); //checking the movie name input field
      await expect(page.locator('#release')).toBeVisible(); //checking the movie release date input field
      await page.getByPlaceholder('Name').click();
      await page.getByPlaceholder('Name').fill(newMovieName);
      await page.locator('#release').fill(newMovieDate);
      await expect(page.getByRole('button', { name: 'Create Movie' })).toBeEnabled(); //checking whether submit button is enabled
      await page.getByRole('button', { name: 'Create Movie' }).click();
      await expect(page.getByRole('status')).toHaveText("Successfully Added"); //checking whether getting the confirmation message after adding movies
      await expect(page.locator(`xpath=//h1[text()="${newMovieName}"]`)).not.toHaveCount(0) //checking whether the movie got updated in the list
    });
    test('Verify that "Add new review" functionality adds a movie in the Movie List', async ({ page }) => {
      await page.getByRole('button', { name: 'Add new review' }).click();
      await page.locator('#movie').selectOption(newMovieName);
      await page.getByPlaceholder('Your name').click();
      await page.getByPlaceholder('Your name').fill(yourName);
      await page.getByPlaceholder('Rating out of').click();
      await page.getByPlaceholder('Rating out of').fill(rating);
      await page.getByPlaceholder('Review comments').click();
      await page.getByPlaceholder('Review comments').fill(review);
      await page.getByRole('button', { name: 'Create Review' }).click();
      await expect(page.getByRole('status')).toHaveText("Successfully Added",{timeout:5000}); //checking whether getting the confirmation message after adding movies
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(newMovieName);
      await page.locator(`xpath=//h1[contains(text(),"${newMovieName}")]`).click();
      await page.waitForTimeout(5000)
      await expect(page.locator(`xpath=//div[@id="review"]//p[contains(text(),"${review}")]`)).toHaveText(review,{timeout:5000}); // checking whether the review comment got updated
      await expect(page.locator(`xpath=//h6[contains(@class,"mt-8")]//em[text()="${yourName}"]`)).toHaveText(`By ${yourName}`);
    });

    test('Verify that editing a movie updates the movie details in the list', async ({ page }) => {
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(sampleMovie);
      await page.waitForTimeout(4000);
      await page.getByRole('button').nth(2).click();
      await page.waitForTimeout(3000)
      await page.getByPlaceholder('Name').click();
      await page.getByPlaceholder('Name').fill(editMovie);
      await page.locator('#release').fill(editMovieDate);
      await page.getByRole('button', { name: 'Update Movie' }).click();
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(editMovie);
      await page.waitForTimeout(4000)
      await expect(page.locator(`xpath=//h1[contains(text(),"${editMovie}")]`)).toBeVisible();
    });


    test('Verify that deleting a movie deletes the movie from the list', async ({ page }) => {
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(deleteMovie);
      await page.waitForTimeout(4000);
      await page.getByRole('button').nth(3).click();
      await expect(page.getByRole('status')).toHaveText("Successfully Deleted",{timeout:5000}); //checking whether getting the confirmation message after deleting a movie
      await page.waitForTimeout(3000)
      await page.reload({waitUntil:"networkidle"});
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(deleteMovie);
      await page.waitForTimeout(4000);
      await expect(page.locator(`xpath=//h1[contains(text(),"${newMovieName}")]`)).not.toBeVisible();
    });

    test('Verify the review edit option for a movie in the review page', async ({ page }) => {
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(staticMovie);
      await page.waitForTimeout(4000);
      await page.locator(`xpath=//h1[contains(text(),"${staticMovie}")]`).click();
      await page.waitForTimeout(3000);
      await page.getByRole('main').getByRole('button').first().click();
      await page.getByPlaceholder('Review comments').click();
      await page.getByPlaceholder('Review comments').fill('music');
      await page.getByRole('button', { name: 'Update Review' }).click();
      await expect(page.getByRole('status')).toHaveText("Successfully Updated"); //checking whether getting the confirmation message after editing reviews
      await page.waitForTimeout(3000);
      await expect(page.getByText('music',{exact:true})).toBeVisible(); //checking whether the review comment is updated
    });

    test('Verify the delete review operation for a movie in the review page', async ({ page }) => {
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(staticMovie);
      await page.waitForTimeout(4000);
      await page.locator(`xpath=//h1[contains(text(),"${staticMovie}")]`).click();
      await page.waitForTimeout(3000);
      await page.getByRole('main').getByRole('button').nth(1).click();
      await expect(page.getByRole('status')).toHaveText("Review Deleted"); //checking whether getting the confirmation message after deleting reviews
    });

    test('Verify the average rating in reviews page', async ({ page }) => {
      await page.getByPlaceholder('Search for your favorite movie').click();
      await page.getByPlaceholder('Search for your favorite movie').fill(staticMovie);
      await page.waitForTimeout(4000);
      await page.locator(`xpath=//h1[contains(text(),"${staticMovie}")]`).click();
      await page.waitForTimeout(3000);
      let movieReviews= await page.locator('xpath=//div[contains(@class,"border-2")]//div[@class="flex justify-between"]//p[2]').allInnerTexts();
      let sum=0;
      let avg=0;
      for(let i=0;i<movieReviews.length;i++){
        let temp=parseFloat(movieReviews[i].split('/')[0])
        sum+=temp;
        console.log(temp)
        temp=0
      }
      avg=(sum/(movieReviews.length))
      let finalavg=parseFloat(avg.toFixed(2))
      console.log("Actual Average is: ",finalavg)
      let averageRatingReviewPage= await page.locator('xpath=//div[@class="my-8 flex justify-between"]//p').innerText();
      let displayedAverageRating= parseFloat(averageRatingReviewPage.split('/')[0]);
      console.log("Displayed Average is: ",displayedAverageRating)
      test.fail(displayedAverageRating!=finalavg,"Average rating calculation is not correct")
    });
});

