import { describe, expect, it, vi } from 'vitest';
vi.mock('$app/environment', () => ({ building: false }));
import { localeHandle } from './server';
import { resolveLocale, localeHref, routeParts, preferenceResponse } from './core';
import { message, templateText, dealerLabel } from './messages';
import { stockValue } from './stock';
const event = (path: string, method = 'GET', headers: Record<string, string> = {}) => ({
	url: new URL(path, 'https://cars.example'),
	request: new Request(new URL(path, 'https://cars.example'), { method, headers }),
	locals: {}
});
async function handle(path: string, method = 'GET', headers: Record<string, string> = {}) {
	const requestEvent = event(path, method, headers);
	const downstream = vi.fn(
		async (e, options) =>
			new Response(
				options.transformPageChunk({
					html: `<html lang="%cars.locale%">${e.locals.localeState.locale}</html>`
				}),
				{ headers: { 'Content-Type': 'text/html', Vary: 'User-Agent' } }
			)
	);
	const response = await localeHandle({ event: requestEvent, resolve: downstream } as never);
	return { response, downstream, requestEvent };
}
describe('native Carwow locale adapter', () => {
	it('keeps explicit URL language ahead of saved preferences', () =>
		expect(
			resolveLocale({
				url: new URL('https://cars.example/variant-3/en/inventory'),
				cookie: 'cars_locale=bg; cars_country=GB',
				acceptLanguage: 'bg'
			})
		).toMatchObject({ locale: 'en', country: 'GB', source: 'url' }));
	it('keeps route identity and dealer facts independent', () => {
		expect(routeParts('/variant-3/bg/inventory')).toMatchObject({
			base: '/variant-3',
			locale: 'bg',
			path: '/inventory'
		});
		expect(dealerLabel('en', 'city')).toBe('Sofia');
		expect(stockValue('en', 'Mercedes-Benz')).toBe('Mercedes-Benz');
		expect(stockValue('en', '80 000 км')).toBe('80,000 km');
	});
	it('preserves mount, query and hash, and resource URLs', () => {
		expect(localeHref('/variant-3/bg/inventory?q=BMW#filters', 'en')).toBe(
			'/variant-3/en/inventory?q=BMW#filters'
		);
		for (const value of [
			'/api/leads',
			'/admin',
			'https://example.com/a',
			'tel:+359123',
			'/assets/a.webp'
		])
			expect(localeHref(value, 'en')).toBe(value);
	});
	it('fails on unknown immutable copy and missing parameters', () => {
		expect(() => templateText('en', 'unreviewed interface message')).toThrow();
		expect(() => message('en', 'locale.suggestion')).toThrow('Missing parameter');
	});
	it('preserves original device vary with private locale responses', async () => {
		const { response, downstream } = await handle('/en');
		expect(downstream).toHaveBeenCalledOnce();
		expect(response.headers.get('vary')).toContain('User-Agent');
		expect(response.headers.get('vary')).toContain('Cookie');
		expect(response.headers.get('cache-control')).toContain('no-store');
		expect(await response.text()).toContain('lang="en"');
	});
	it('isolates concurrent requests', async () => {
		const outputs = await Promise.all(
			Array.from({ length: 40 }, (_, i) =>
				handle(i % 2 ? '/bg' : '/en', 'GET', {
					cookie: i % 2 ? 'cars_locale=en' : 'cars_locale=bg'
				})
			)
		);
		for (let i = 0; i < outputs.length; i++)
			expect(await outputs[i].response.text()).toContain(i % 2 ? 'lang="bg"' : 'lang="en"');
	});
	it('redirects legacy URLs without dropping query', async () => {
		const { response, downstream } = await handle('/variant-3/inventory?q=BMW', 'GET', {
			'accept-language': 'en'
		});
		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe('/variant-3/en/inventory?q=BMW');
		expect(downstream).not.toHaveBeenCalled();
	});
	it('leaves admin authentication downstream and English-only', async () => {
		const { requestEvent, downstream } = await handle('/admin', 'GET', {
			cookie: 'cars_locale=bg'
		});
		expect(requestEvent.locals).toMatchObject({ localeState: { locale: 'en' } });
		expect(downstream).toHaveBeenCalledOnce();
	});
	for (const path of ['/api/leads', '/api/import-requests', '/api/chat', '/variant-3/api/leads'])
		it(`fails closed before business handlers: ${path}`, async () => {
			const { response, downstream } = await handle(path, 'POST');
			expect(response.status).toBe(403);
			expect(downstream).not.toHaveBeenCalled();
		});
	it('dismisses without accepting preferences', async () => {
		const response = await preferenceResponse(
			new Request('https://cars.example/api/preferences', {
				method: 'POST',
				headers: { origin: 'https://cars.example', 'content-type': 'application/json' },
				body: JSON.stringify({
					action: 'dismiss',
					locale: 'en',
					country: 'GB',
					returnTo: '/bg/inventory?q=BMW#filters'
				})
			})
		);
		expect(response.status).toBe(200);
		const cookies = response.headers.getSetCookie();
		expect(cookies).toHaveLength(1);
		expect(cookies[0]).toContain('cars_prompt=');
		expect(cookies[0]).toContain('HttpOnly');
		expect(cookies[0]).toContain('Secure');
		expect(cookies[0]).not.toContain('Domain=');
	});
});
