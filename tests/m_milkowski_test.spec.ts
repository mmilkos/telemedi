import {expect, test} from "@/fixtures/fixtures";

const consultationTestData = {
    medicineItem: 'Claritine',
    ailment: 'Alergia',
    paymentUrl: /^https:\/\/secure\.payu\.com\/pay\/\?orderId=.*$/
}


test.beforeEach(async ({ loginPage, consultationCleanup }) => {
    consultationCleanup.token = await loginPage.login(process.env.npm_config_login!, process.env.npm_config_password!);

    await test.step('Zweryfikuj poprawność logowania', async () => {
        await expect(loginPage.loginBtn).not.toBeVisible();
        await expect(loginPage.usernameInput).not.toBeVisible();
        await expect(loginPage.passwordInput).not.toBeVisible();
    });
});

test('Umawianie konsultacji z ankietą medyczną', async ({ homePage, prescriptionConsultationPage, page, consultationCleanup }) => {
    await homePage.clickOnBookVisitBtn();
    await homePage.clickOnPrescriptionBtn();

    await prescriptionConsultationPage.pickAilment(consultationTestData.ailment);

    const apiPrice = await prescriptionConsultationPage.getPriceFromApi(async () => {
        await prescriptionConsultationPage.pickMedicineItem(consultationTestData.medicineItem);
    });

    const price = await prescriptionConsultationPage.getPriceFromElement(prescriptionConsultationPage.prescriptionPrice);

    await test.step('Zweryfikuj poprawność danych na stronie podsumowania', async () => {
        expect(price).toEqual(apiPrice);
        await expect(prescriptionConsultationPage.prescriptionTitleBox).toContainText(consultationTestData.medicineItem)
    });

    await prescriptionConsultationPage.tickAllBoxes();

    consultationCleanup.idToClean = await prescriptionConsultationPage.submitFormAndGetConsultationId(price);

    await expect(page).toHaveURL(consultationTestData.paymentUrl);
});