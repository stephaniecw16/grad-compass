import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context, page }) => {
  await context.route('**/*', async (route) => {
    if (new URL(route.request().url()).hostname === '127.0.0.1') return route.continue();
    throw Error('Local planner tests must not contact external services.');
  });
  page.on('pageerror', (error) => {
    throw error;
  });
});
async function signup(page, email, name) {
  await page.goto('/account.html');
  await page.getByLabel('Save Location').selectOption('local');
  await page.getByLabel('Your Name').fill(name);
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('Fictional-Planner-Password-2026');
  await page.getByRole('button', { name: 'Create My Free Account' }).click();
  await expect(page.locator('#account-status')).toContainText(email);
}

test('visitors research all AMS programs and compare evidence without signing in', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#results .card')).toHaveCount(24);
  await expect(page.getByRole('heading', { name: /Find the Math Program/ })).toBeVisible();
  await expect(page.locator('#results')).not.toContainText('Example Test University');
  await page.getByRole('searchbox', { name: 'Search Programs' }).fill('Brown');
  await expect(page.locator('#results .card')).toHaveCount(4);
  await page.locator('[data-compare="brown-math"]').check();
  await page.locator('[data-compare="brown-applied"]').check();
  await page.getByRole('link', { name: /Compare Schools/ }).click();
  await expect(page.getByRole('table').locator('thead th')).toHaveCount(3);
  for (const name of [
    'GRE General',
    'GRE Math Subject',
    'Application Fee · Domestic',
    'Fee Waiver / Request Eligibility',
    'Average Years to Graduation',
    'Graduate Teaching / TA Requirements',
  ])
    await expect(page.getByRole('rowheader', { name, exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Choose Programs' }).click();
  await page.locator('[data-details="brown-math"]').click();
  await expect(page.getByRole('dialog')).toContainText('Program Sources');
  await expect(
    page
      .getByRole('dialog')
      .getByRole('link', { name: /University Source/ })
      .first(),
  ).toHaveAttribute('href', /^https:\/\//);
  await page.getByRole('button', { name: 'Close Details' }).click();
  await expect(page.locator('a[href*="#application"]')).toHaveCount(0);
});

test('student saves research, checklist, profile and deadlines, exports calendar, and reloads', async ({
  page,
}) => {
  await signup(page, 'planner-a@example.invalid', 'Fictional Student A');
  await page.getByRole('link', { name: 'Program Directory', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search Programs' }).fill('Brown');
  await page.locator('[data-save="brown-math"]').click();
  await expect(page.locator('#toast')).toContainText('Program Saved');
  await page.getByRole('link', { name: 'Saved Programs', exact: true }).click();
  await page
    .getByLabel('Research Notes')
    .fill('Fictional note: interested in analysis <img src=x onerror=alert(1)>');
  await page.getByLabel('Planning Stage').selectOption('Shortlisted');
  await page.getByLabel('My Planning Deadline').fill('2027-01-06');
  await page.getByRole('checkbox', { name: 'Check Funding and Teaching' }).check();
  await expect(page.locator('#save-state')).toHaveText('Unsaved Changes');
  await page.getByRole('button', { name: 'Save All Program Changes' }).click();
  await expect(page.locator('#toast')).toContainText('Changes Saved');
  await page.reload();
  await expect(page.getByLabel('Research Notes')).toHaveValue(/Fictional note/);
  await expect(page.getByRole('checkbox', { name: 'Check Funding and Teaching' })).toBeChecked();
  await expect(page.locator('#view img')).toHaveCount(0);
  await page.getByRole('link', { name: 'My Profile', exact: true }).first().click();
  await page.getByLabel('Your Name').fill('Fictional Planning Student');
  await page.getByLabel('College or University').fill('Example College');
  await page.getByLabel('Mathematical Interests').fill('Analysis and geometry');
  await page.getByRole('button', { name: 'Save My Profile' }).click();
  await page.reload();
  await expect(page.getByLabel('College or University')).toHaveValue('Example College');
  await page.getByRole('link', { name: 'Deadlines', exact: true }).click();
  await expect(page.locator('#view')).toContainText('2027-01-06');
  await expect(page.locator('#view')).toContainText('Your Personal Planning Date');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Calendar' }).click();
  expect((await download).suggestedFilename()).toBe('GradApp-Planning-Deadlines.ics');
});

test('two local student accounts have separate plans and can sign back in', async ({ page }) => {
  await signup(page, 'isolation-a@example.invalid', 'Fictional A');
  await page.getByRole('link', { name: 'Program Directory', exact: true }).click();
  await page.locator('[data-save="auburn"]').click();
  await expect(page.locator('#toast')).toContainText('Program Saved');
  await page.getByRole('button', { name: 'Sign Out', exact: true }).click();
  await signup(page, 'isolation-b@example.invalid', 'Fictional B');
  await expect(page.locator('#view')).not.toContainText('Auburn University');
  await page.getByRole('button', { name: 'Sign Out', exact: true }).click();
  await page.goto('/account.html?mode=signin');
  await page.getByLabel('Save Location').selectOption('local');
  await page.getByLabel('Email Address').fill('isolation-a@example.invalid');
  await page.getByLabel('Password', { exact: true }).fill('Fictional-Planner-Password-2026');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.locator('#view')).toContainText('Auburn University');
  await page.locator('[data-remove="auburn"]').click();
  await expect(page.locator('#view')).toContainText('Start with a Few Possibilities');
});

test('saving as a visitor continues after signup and retired staff routes do not grant access', async ({
  page,
}) => {
  await page.goto('/#directory');
  await page.locator('[data-save="baylor"]').click();
  await expect(page).toHaveURL(/account.html/);
  await page.getByRole('button', { name: 'Open the Student Demo' }).click();
  await expect(page.locator('#view')).toContainText('Baylor University');
  await page.goto('/staff.html');
  await expect(page.locator('main')).toContainText('separate AppHelper');
  await expect(page.locator('form')).toHaveCount(0);
  await page.goto('/workspace.html?demo=1&view=administration#department');
  await expect(page.locator('#results .card')).toHaveCount(24);
  await expect(page.locator('#department-workspace')).toHaveCount(0);
});

test('mobile planner fits and warns before leaving unsaved notes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/account.html#demo');
  await page.getByRole('button', { name: 'Open the Student Demo' }).click();
  await page.getByRole('link', { name: 'Program Directory', exact: true }).click();
  await expect(page.locator('#results .card')).toHaveCount(24);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.locator('[data-save="baylor"]').click();
  await page.getByRole('link', { name: 'Saved Programs', exact: true }).click();
  await page.getByLabel('Research Notes').fill('Unsaved fictional notes');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('link', { name: 'Deadlines', exact: true }).click();
  await expect(page.getByLabel('Research Notes')).toHaveValue('Unsaved fictional notes');
  await page.getByRole('button', { name: 'Save All Program Changes' }).click();
  await expect(page.locator('#save-state')).toHaveText('All Changes Saved');
});

test('the complete AMS catalog supports pagination, Canadian and degree filters, and honest verification labels', async ({
  page,
}) => {
  await page.goto('/#directory');
  await expect(page.locator('#result-count')).toContainText('742 of 742');
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await expect(page.locator('#pagination')).toContainText('Page 2 of 31');
  await page.getByLabel('Country', { exact: true }).selectOption('Canada');
  await page.getByLabel('Degree Type', { exact: true }).selectOption('Masters');
  await page.getByRole('searchbox', { name: 'Search Programs' }).fill('Acadia');
  await expect(page.locator('#results .card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Program Details', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Nova Scotia');
  await expect(page.getByRole('dialog')).toContainText('AMS Reported');
  await expect(page.getByRole('dialog')).toContainText('Not Verified');
  await expect(page.getByRole('dialog')).toContainText('University Source');
  await page.getByRole('button', { name: 'Close Details' }).click();
  await page.getByRole('searchbox', { name: 'Search Programs' }).fill('Youngstown');
  await page.getByLabel('Country', { exact: true }).selectOption('');
  await page.getByLabel('Degree Type', { exact: true }).selectOption('');
  await expect(page.locator('#results .card')).toHaveCount(2);
});

test('funding tab exposes official eligibility, checklists, and closed-cycle dates', async ({
  page,
}) => {
  await page.goto('/#funding');
  await expect(
    page.getByRole('heading', { name: 'Scholarships and Fellowships', exact: true }),
  ).toBeVisible();
  await expect(page.locator('[data-fellowship]')).toHaveCount(8);
  await page.getByRole('searchbox', { name: 'Search Funding' }).fill('CSGF');
  await expect(page.locator('[data-fellowship]')).toHaveCount(1);
  await expect(page.locator('#funding-results')).toContainText('2027-01-07');
  await expect(page.locator('#funding-results')).toContainText(
    'applicant-sent copies are not accepted',
  );
  await page.getByRole('searchbox', { name: 'Search Funding' }).fill('NSF');
  await expect(page.locator('#funding-results')).toContainText('Deadline Passed');
  await expect(page.locator('#funding-results')).toContainText('2026-10-16');
  await expect(page.locator('#funding-results a').first()).toHaveAttribute('href', /nsf26-526/);
  await page.getByRole('searchbox', { name: 'Search Funding' }).fill('No such award');
  await expect(page.getByRole('heading', { name: 'No Matching Funding' })).toBeVisible();
});

test('writing requirements show scoped prompts, unknowns, and saved-program navigation', async ({
  page,
}) => {
  await page.goto('/#requirements');
  await expect(page.locator('#writing-count')).toContainText('742 matching');
  await page.getByRole('searchbox', { name: 'Search Application Requirements' }).fill('Stanford');
  await page.getByLabel('Research Coverage').selectOption('Published Guidance');
  await expect(page.locator('#writing-results')).toContainText('1–2 paragraphs');
  await page.getByLabel('Degree to Research').selectOption('Masters');
  await expect(page.getByRole('heading', { name: 'No Matching Programs' })).toBeVisible();
  await signup(page, 'writing-demo@example.invalid', 'Fictional Writing Researcher');
  await page.getByRole('link', { name: 'Program Directory', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search Programs' }).fill('Brown');
  await page.locator('[data-save="brown-math"]').click();
  await expect(page.locator('#toast')).toContainText('Program Saved');
  await page.getByRole('link', { name: 'Saved Programs', exact: true }).click();
  await page.getByRole('button', { name: 'View Statements and Questions' }).click();
  await expect(page.locator('#writing-results')).toContainText('Mathematical Idea Video');
  await expect(page.locator('[data-writing-program]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Show All Programs' }).click();
  await page.getByLabel('Saved Programs Only').check();
  await expect(page.locator('[data-writing-program]')).toHaveCount(1);
  await page.reload();
  await page.getByRole('searchbox', { name: 'Search Application Requirements' }).fill('Baylor');
  await expect(page.locator('#writing-results')).toContainText('Not Verified');
});

test('account entry offers guest comparison even when online account access is unavailable', async ({
  page,
}) => {
  await page.route('**/public-config.json', (route) =>
    route.fulfill({ status: 503, body: 'Unavailable' }),
  );
  await page.goto('/account.html');
  await expect(page.getByRole('heading', { name: 'Browse Without an Account' })).toBeVisible();
  await page.getByRole('link', { name: 'Continue Without an Account', exact: true }).click();
  await expect(page.locator('#account-status')).toContainText('No Account Needed');
  await expect(page.locator('#results .card')).toHaveCount(24);
  await page.getByRole('searchbox', { name: 'Search Programs' }).fill('Brown');
  await page.locator('[data-compare="brown-math"]').check();
  await page.locator('[data-compare="brown-applied"]').check();
  await page.getByRole('link', { name: /Compare Schools/ }).click();
  await expect(page.getByRole('table').locator('thead th')).toHaveCount(3);
  await expect(page).toHaveURL(/#compare$/);
  await expect(page.locator('#view')).not.toContainText('Create Free Account');
});

test('guests filter professional contacts, open sourced department details and compare contacts', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Contact Information').selectOption('department');
  await expect(page.locator('#results .card').first()).toBeVisible();
  await page.locator('[data-details]').first().click();
  const panel = page
    .getByRole('dialog')
    .getByRole('region', { name: 'Department Websites and Contacts' });
  await expect(panel.getByRole('heading', { name: 'Whom to Contact' })).toBeVisible();
  await expect(panel.locator('a[href^="mailto:"]').first()).toBeVisible();
  await expect(panel).toContainText('University Source');
  await expect(panel.getByRole('link', { name: 'Contact Source' }).first()).toHaveAttribute(
    'href',
    /^https?:\/\//,
  );
  await page.getByRole('button', { name: 'Close Details' }).click();
  await page.locator('[data-compare]').nth(0).check();
  await page.locator('[data-compare]').nth(1).check();
  await page.getByRole('link', { name: /Compare Schools/ }).click();
  await expect(
    page.getByRole('rowheader', { name: 'Department / Admissions Contacts', exact: true }),
  ).toBeVisible();
  await expect(page.locator('table a[href^="mailto:"]').first()).toBeVisible();
});

test('online sign-in can retry after a temporary account configuration failure', async ({
  page,
}) => {
  let configRequests = 0;
  await page.route('**/public-config.json', (route) => {
    configRequests++;
    return route.fulfill(
      configRequests === 1
        ? { status: 503, body: 'Temporarily unavailable' }
        : {
            json: {
              supabaseUrl: 'https://fictional.supabase.co',
              supabasePublishableKey: 'sb_publishable_test_fixture',
            },
          },
    );
  });
  await page.route('https://fictional.supabase.co/auth/v1/token*', (route) =>
    route.fulfill({
      status: 400,
      json: { code: 'invalid_credentials', msg: 'Invalid login credentials' },
    }),
  );
  await page.goto('/account.html?mode=signin');
  await page.getByLabel('Email Address').fill('beta-retry@example.invalid');
  await page.getByLabel('Password', { exact: true }).fill('Fictional-Retry-Password');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.locator('#account-message')).toContainText('Online accounts are unavailable');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.locator('#account-message')).toContainText('Invalid login credentials');
  expect(configRequests).toBe(2);
});

test('failed local profile saves preserve edits and can be retried', async ({ page }) => {
  await signup(page, 'beta-profile@example.invalid', 'Fictional Beta Profile');
  await page.getByRole('link', { name: 'My Profile', exact: true }).first().click();
  await page.getByLabel('Your Name').fill('Fictional Profile Recovery');
  await page.getByLabel('College or University').fill('Example Beta College');
  await page.getByLabel('Mathematical Interests').fill('Geometry and mathematical statistics');
  await page.evaluate(() => {
    window.betaOriginalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith('gradapp.student-planner.v1.'))
        throw new DOMException('Fictional storage quota failure', 'QuotaExceededError');
      return window.betaOriginalSetItem.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Save My Profile' }).click();
  await expect(page.locator('#save-state')).toContainText('Fictional storage quota failure');
  await expect(page.getByLabel('College or University')).toHaveValue('Example Beta College');
  await expect(page.getByRole('button', { name: 'Save My Profile' })).toBeEnabled();
  await page.evaluate(() => {
    Storage.prototype.setItem = window.betaOriginalSetItem;
  });
  await page.getByRole('button', { name: 'Save My Profile' }).click();
  await expect(page.locator('#save-state')).toHaveText('All Changes Saved');
  await page.reload();
  await expect(page.getByLabel('College or University')).toHaveValue('Example Beta College');
  await expect(page.getByLabel('Mathematical Interests')).toHaveValue(
    'Geometry and mathematical statistics',
  );
});

test('empty searches, three-school comparisons and removing saved programs work', async ({
  page,
}) => {
  await page.goto('/#directory');
  await page
    .getByRole('searchbox', { name: 'Search Programs' })
    .fill('No matching fictional program 123456');
  await expect(page.locator('#result-count')).toContainText('0 of 742');
  await expect(page.locator('#results .card')).toHaveCount(0);
  await page.getByRole('searchbox', { name: 'Search Programs' }).fill('Brown');
  for (const id of ['brown-math', 'brown-applied']) {
    await page.locator('[data-compare="' + id + '"]').check();
  }
  await page.locator('[data-compare]').nth(2).check();
  await page.getByRole('link', { name: /Compare Schools/ }).click();
  await expect(page.getByRole('table').locator('thead th')).toHaveCount(4);
  await page.getByRole('button', { name: 'Remove from Comparison' }).first().click();
  await expect(page.getByRole('table').locator('thead th')).toHaveCount(3);
  await signup(page, 'beta-remove@example.invalid', 'Fictional Beta Remove');
  await page.getByRole('link', { name: 'Program Directory', exact: true }).click();
  await page.locator('[data-save="auburn"]').click();
  await page.getByRole('link', { name: 'Saved Programs', exact: true }).click();
  await page.locator('[data-remove="auburn"]').click();
  await expect(page.locator('#toast')).toContainText('Program Removed');
  await page.reload();
  await expect(page.locator('[data-remove]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Deadlines', exact: true }).click();
  await expect(page.locator('#view')).toContainText('No Deadlines Yet');
});
