import {BasePage} from "@/pages/base-page";
import {Page, test} from '@/fixtures/fixtures';
import {Locator} from "playwright-core";


export class PrescriptionConsultationPage extends BasePage {
    prescriptionTitleBox: Locator;
    prescriptionPrice: Locator;
    checkAllCheckBox: Locator;
    bookForFreeBtn: Locator;
    nextBtn: Locator;
    confirmDataBtn: Locator;

    constructor(page: Page) {
        super(page);

        this.prescriptionTitleBox = this.page.locator('.prescription-tile-box');
        this.prescriptionPrice = this.page.locator('.prescription_price');
        this.checkAllCheckBox = this.page.locator('label[for="checkAll"]');
        this.bookForFreeBtn = this.page.getByRole('button', {name: 'Umów za 0 PLN*'});
        this.nextBtn = this.page.getByRole('button', {name: 'Dalej'});
        this.confirmDataBtn = this.page.getByRole('button', {name: 'Potwierdź poprawność danych'});
    }

    async pickAilment(name: string): Promise<void>{
        await test.step(`Wybierz przypadłość: ${name}`, async ()=>{
            await this.page.getByText(name).click();
        })
    }

    async pickMedicineItem(name: string): Promise<void>{
        await test.step(`Wybierz lek: ${name}`, async()=> {
            await this.page.getByText(name).click();
        })
    }

    async getPriceFromElement(element: Locator): Promise<string> {
        return await test.step('Pobierz cenę z elementu', async () => {
            const text = await element.textContent() || '';

            const match = text.match(/\d.*/);

            return match ? match[0] : '';
        });
    }

    async getPriceFromApi(actionFn: () => Promise<void>): Promise<string> {
        return await test.step('Pobierz cenę z API', async () => {

            const response = await this.waitForResponseAfter('POST', 'consultations/check-price',async () =>{
                await actionFn()
            } )

            const body = await response.json();
            return `${body.fullPrice} ${body.currency}`;
        });
    }

    async tickAllBoxes(): Promise<void>{
        await test.step('Kliknij zaznacz wszystkie', async () =>{
            await this.checkAllCheckBox.click();
        })
    }

    async submitFormAndGetConsultationId(price: string): Promise<string> {
        return await test.step('Zatwierdź formularz i pobierz ID konsultacji z API', async () => {
            const response = await this.waitForResponseAfter('POST', '/api/v2/consultations', async () =>{
                await this.clickOnBookForPriceBtn(price);
            }, 201)

            const body = await response.json();
            return body.id;
        });
    }

    private async clickOnBookForPriceBtn(price: string): Promise<void>{
        await test.step(`Kliknij w przycisk "Umów za ${price} "`, async ()=>{
            await this.page.getByRole('button', { name: `Umów za ${price}`, exact: false }).click();
        })
    }
}