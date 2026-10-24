import {Locator, Page, test} from '@/fixtures/fixtures';
import {BasePage} from "@/pages/base-page";

export class LoginPage extends BasePage{
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;

    constructor(page: Page) {
        super(page)
        this.usernameInput = this.page.getByTestId('username');
        this.passwordInput = this.page.getByTestId('password');
        this.loginBtn = this.page.getByRole('button', {name: 'Zaloguj się', exact: true});
    }

    public async login(login: string, password: string): Promise<string> {
        return await test.step('Wprowadź login i hasło i kontynuuj', async () => {
            await this.usernameInput.fill(login);
            await this.passwordInput.fill(password);

            const response = await this.waitForResponseAfter('POST', 'ogin-password-grant', async () => {
                await this.loginBtn.click();
            });

            const body: {token: {accessToken: string}} = await response.json();

            return body.token.accessToken;
        });
    }
}