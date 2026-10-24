import {expect, test} from "@/fixtures/fixtures";
import * as crypto from 'crypto';

const today = new Date();
const futureDate = new Date();
futureDate.setDate(today.getDate() + 2);
const randomString = crypto.randomBytes(8).toString('hex');

const consultationTestData = {
    medicineItem: 'Claritine',
    ailment: 'Alergia',
    paymentUrl: /^https:\/\/secure\.payu\.com\/pay\/\?orderId=.*$/
}

const remoteConsultationData = {
    specialization: 'Dermatolog',
    channel: 'Czat',
    date: futureDate,
    promoCode: randomString,
    paymentUrl: /^https:\/\/secure\.payu\.com\/pay\/\?orderId=.*$/
}

const formattedDate = remoteConsultationData.date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});


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

test.only('Umówienie wizyty zdalnej chat @known-bug', async ({page, homePage, makeConsultationPage, consultationCleanup }) => {
    await homePage.clickOnBookVisitBtn();
    await homePage.clickOnRemoteVisitBtn();

    await makeConsultationPage.pickSpecialization(remoteConsultationData.specialization);
    const price = await makeConsultationPage.getPriceFromElement(makeConsultationPage.specializationInput);
    await makeConsultationPage.pickChannel(remoteConsultationData.channel);
    await makeConsultationPage.pickDate(remoteConsultationData.date);
    await makeConsultationPage.pickFirstDate();

    await expect(makeConsultationPage.page.getByText(formattedDate)).toBeVisible();
    await expect(makeConsultationPage.page.getByText(remoteConsultationData.channel)).toBeVisible();
    await expect(makeConsultationPage.page.getByText(remoteConsultationData.specialization)).toBeVisible();

    await makeConsultationPage.addPromoCode(randomString);

    await test.step('Sprawdź czy błędny kod powoduje odpowiedni błąd w UI aplikacji', async()=>{
        await expect.soft(makeConsultationPage.page.getByText(`Kod ${randomString} nie istnieje.`)).toBeVisible();
    })

    consultationCleanup.idToClean = await makeConsultationPage.submitFormAndGetConsultationId(price);

    await expect(page).toHaveURL(remoteConsultationData.paymentUrl);
});