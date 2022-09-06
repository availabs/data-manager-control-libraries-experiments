export const FSAEventParam = {
	type: {
		type: "string",
		optional: false,
	},
	payload: {
		type: "any",
		optional: true,
	},
	metadata: {
		type: "record",
		optional: true,
	},
	error: {
		type: "record",
		optional: true,
	},
};
