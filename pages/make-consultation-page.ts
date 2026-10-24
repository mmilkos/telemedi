import {BasePage} from "@/pages/base-page";
import {Page, test} from "@/fixtures/fixtures";
import {Locator} from "playwright-core";

export class MakeConsultationPage extends BasePage {

    readonly specializationInput: Locator;
    readonly specializationOptions: Locator;
    readonly radioOptions: Locator;
    readonly todayBtn: Locator;
    readonly tomorrowBtn: Locator;
    readonly otherDateBtn: Locator;

    constructor(page: Page) {
        super(page);

        this.specializationInput = this.page.getByRole('combobox');
        this.specializationOptions = this.page.getByRole('listbox');
        this.radioOptions = this.page.getByRole('radio');
        this.todayBtn = this.page.getByLabel('Dzisiaj');
        this.tomorrowBtn = this.page.getByLabel('Jutro');
        this.otherDateBtn = this.page.locator('label[for="other"]');
    }

    async pickSpecialization(name: string){
        await test.step(`Wybierz specjalizację ${name}`, async()=>{
            await this.waitForResponseAfter('POST', 'consultations/check-price', async ()=>{
                await this.specializationInput.click();
                await this.specializationOptions.getByText(name).click();
            })
        })
    }

    async pickChannel(name: string){
        await test.step(`Wybierz kanał: ${name}`, async ()=>{
            await this.waitForResponseAfter('POST', 'consultations/check-price', async()=>{
                await this.page.locator('label').filter({ hasText: name }).click();
            })
        })
    }

    async pickDate(date: Date) {
        const today = new Date();

        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        await test.step(`Wybierz datę: ${date.toLocaleDateString()}`, async () => {
            if (this.isSameDay(date, today)) {
                await this.todayBtn.click();
            } else if (this.isSameDay(date, tomorrow)) {
                await this.tomorrowBtn.click();
            } else {
                await this.otherDateBtn.click();
                await this.handleDatePicker(date)
                await this.page.waitForTimeout(5000)
            }
        });
    }

    private isSameDay (d1: Date, d2: Date): boolean {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    private async handleDatePicker(date: Date) {
        const plMonths: Record<string, number> = {
            'styczeń': 0, 'luty': 1, 'marzec': 2, 'kwiecień': 3, 'maj': 4, 'czerwiec': 5,
            'lipiec': 6, 'sierpień': 7, 'wrzesień': 8, 'październik': 9, 'listopad': 10, 'grudzień': 11
        };

        const targetYear = date.getFullYear();
        const targetMonth = date.getMonth();

        const captionLocator = this.page.locator('.DayPicker-Caption');
        const nextBtn = this.page.getByRole('button', { name: 'Next Month' });

        while (true) {
            const currentCaption = await captionLocator.innerText();
            const [monthName, yearStr] = currentCaption.toLowerCase().split(' ');

            const currentMonth = plMonths[monthName];
            const currentYear = parseInt(yearStr, 10);

            if (currentYear > targetYear || (currentYear === targetYear && currentMonth >= targetMonth)) {
                break;
            }

            await nextBtn.click();

            await this.page.waitForFunction(
                ([selector, prevText]) => document.querySelector(selector)?.textContent !== prevText,
                ['.DayPicker-Caption', currentCaption]
            );
        }

        await this.page.getByRole('gridcell', { name: date.toDateString(), exact: true }).click();
    }
}