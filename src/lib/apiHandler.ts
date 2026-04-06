import { STATUS } from "@/types";

type Handler<T> = (req: Request, context: T) => Promise<Response>;

export function apiHandler<T>(handler: Handler<T>): Handler<T> {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (e) {
      return Response.json({
        status: STATUS.FAILED,
        error: (e as Error).message,
      });
    }
  };
}
