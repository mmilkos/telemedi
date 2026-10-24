import {Page} from '@/fixtures/fixtures';

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
}