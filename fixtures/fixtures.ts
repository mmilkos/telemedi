import {test as base} from '@playwright/test';
import {LoginPage} from "@/pages/login-page";
import {HomePage} from "@/pages/home-page";
import {PrescriptionConsultationPage} from "@/pages/prescription-consultation-page";
import {MakeConsultationPage} from "@/pages/make-consultation-page";


type MyFixtures = {
    loginPage: LoginPage;
    homePage: HomePage;
    prescriptionConsultationPage: PrescriptionConsultationPage;
    makeConsultationPage: MakeConsultationPage;
    autoGoTo: void,
    consultationCleanup: {
        idToClean: string | null;
        token: string | null;
    };
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    prescriptionConsultationPage: async ({ page }, use) => {
        await use(new PrescriptionConsultationPage(page));
    },
    makeConsultationPage: async ({ page }, use) => {
        await use(new MakeConsultationPage(page));
    },
    autoGoTo: [
        async ({ page }, use) => {
            await page.goto('/');
            await use();
        },
        { auto: true }
    ],
    consultationCleanup: async ({ page, request }, use) => {
        const context = { idToClean: null, token: null };
        const API_URL = 'https://testyautomatyczne.telemedi.co';
        const FRONT_URL = 'https://testyautomatyczne.telemedi.com';

        await use(context);

        await request.delete(`${API_URL}/api/v2/consultations/${context.idToClean}`, {
            headers: {
                'x-authorization': `Bearer ${context.token}`,
                'accept': 'application/json',
                'origin': FRONT_URL,
                'referer': `${FRONT_URL}/`
            }
        });
    }
});

export { expect, Locator, Page } from '@playwright/test';