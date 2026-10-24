import {BasePage} from "@/pages/base-page";
import {test, Locator, Page} from "@/fixtures/fixtures";

export class HomePage extends BasePage{
    readonly bookVisitBtn: Locator;
    readonly prescriptionBtn: Locator;
    readonly remoteVisitBtn: Locator;

    constructor(page: Page) {
        super(page);

        this.bookVisitBtn = this.page.getByRole('button', {name: 'Umów się'});
        this.prescriptionBtn = this.page.getByTestId('consultationNestedMenu:prescriptionHeader');
        this.remoteVisitBtn = this.page.getByTestId('consultationNestedMenu:remoteConsultationHeader');
    }

    async clickOnBookVisitBtn(): Promise<void> {
        await test.step('Kliknij w przycisk "Umów się"', ()=>{
            this.bookVisitBtn.click();
        })
    }

    async clickOnPrescriptionBtn(): Promise<void> {
        await test.step('Kliknij w przycisk "Recepta"', async () =>{
            await this.prescriptionBtn.click();
        })
    }

    async clickOnRemoteVisitBtn(): Promise<void> {
        await test.step('Kliknij w przycisk "Wizyta zdalna"', async () =>{
            await this.waitForResponseAfter('GET', '/api/v2/specializations?pagination', async () => {
                await this.remoteVisitBtn.click()
            });
        })
    }
}