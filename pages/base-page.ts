import {Page, test} from '@/fixtures/fixtures';
import {Locator} from "playwright-core";

export abstract class BasePage {
    readonly page: Page;

    protected constructor(page: Page) {
        this.page = page;
    }

    async waitForResponseAfter(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, action: () => Promise<any>, status = 200) {
        const [response] = await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes(url) &&
                res.request().method() === method &&
                res.status() === status
            ),
            action()
        ]);

        return response;
    }


    async getPriceFromElement(element: Locator): Promise<string> {
        return await test.step('Pobierz cenę z elementu', async () => {
            const text = await element.textContent() || '';

            const match = text.match(/\d.*/);

            return match ? match[0] : '';
        });
    }
}