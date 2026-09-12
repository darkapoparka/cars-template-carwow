import { routeSeo } from '$lib/server/daynight-seo';
import { daynightSite } from '$lib/data/daynight-site';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const load: PageServerLoad = ({ url }) => ({
	seo:
		url.searchParams.get('intent') === 'import'
			? {
					...routeSeo('contact'),
					title: `Внос на автомобил | ${daynightSite.shortName}`,
					description: `Изпратете обява или опишете желания автомобил за внос с ${daynightSite.shortName}.`
				}
			: routeSeo('contact')
});
