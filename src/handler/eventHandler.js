export default async (files, client) => {
	for (const file of files) {
		const eventFunction = (await import(`../events/${file}`)).default
		if (eventFunction.disabled) return;
		const event = eventFunction.event || file.split('.')[0];
		const emitter =
			(typeof eventFunction.emitter === 'string'
				? client[eventFunction.emitter]
				: eventFunction.emitter) || client;
		const once = eventFunction.once;

		try {
			emitter[once ? 'once' : 'on'](event, (...args) =>
				eventFunction.run(...args, client),
			);
		}
		catch (error) {
			console.error(error.stack);
		}
	}
};