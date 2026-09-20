import { message, type MessageKey } from './messages';
import { routeParts, type Locale } from './core';
const routes = new Set([
	'',
	'inventory',
	'inventory/map',
	'services',
	'sell-your-car',
	'sell-your-car/request',
	'favorites',
	'about',
	'about/daynight-auto-plovdiv',
	'contact',
	'financing',
	'reviews',
	'calculator',
	'compare',
	'team',
	'blog',
	'faq',
	'terms'
]);
/** Static route metadata is authored copy. Dynamic listing/CMS facts stay caller-owned. */
export function localizedSeo(
	locale: Locale,
	pathname: string,
	input: { title: string; description: string }
) {
	const path = routeParts(pathname).path.replace(/^\/+|\/+$/g, '');
	if (!routes.has(path)) return input;
	const key = 'seo.' + (path || 'home').replaceAll('/', '.');
	return {
		title: message(locale, (key + '.title') as MessageKey),
		description: message(locale, (key + '.description') as MessageKey)
	};
}
