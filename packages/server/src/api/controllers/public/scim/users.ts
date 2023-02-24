import { UserCtx } from "../../../../../../types/src/sdk"

export const get = async (ctx: UserCtx, next: any) => {
  ctx.body = [{ ok: true }]
  await next()
}
