import uuid from "uuid";

import { Context } from "moleculer";

const cleanTypeName = (type: string) =>
	type
		.toLowerCase()
		.replace(/[^0-9a-z_]/, "-")
		.replace(/-+/, "-");

export default function createDataManagerActionCreators(
	ctx: Context,
	DataManagerEvent: Record<string, string>
) {
	const { params } = ctx;

	// @ts-ignore
	const { pg_env } = params || null;

	const id = uuid.v4();

	let start_time: string;

	const start = () => {
		start_time = new Date().toISOString();

		const type = DataManagerEvent.START;

		const eventName = `data_manager.${cleanTypeName(type)}`;

		const event = {
			type,
			payload: params,
			meta: {
				id,
				pg_env,
				start_time,
			},
		};

		ctx.emit(eventName, event);
	};

	const done = (result: any) => {
		const end_time = new Date().toISOString();

		const type = DataManagerEvent.DONE;

		const eventName = `data_manager.${cleanTypeName(type)}`;

		const event = {
			type,
			payload: { params, result },
			meta: {
				id,
				pg_env,
				start_time,
				end_time,
			},
		};

		ctx.emit(eventName, event);
	};

	const error = (err: Error) => {
		const end_time = new Date().toISOString();

		const type = DataManagerEvent.DONE;

		const eventName = `data_manager.${cleanTypeName(type)}`;

		const event = {
			type,
			payload: err,
			meta: {
				id,
				pg_env,
				start_time,
				end_time,
			},
		};

		ctx.emit(eventName, event);
	};

	return { start, done, error };
}
