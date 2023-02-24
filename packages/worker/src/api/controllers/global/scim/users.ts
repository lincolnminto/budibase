import { Ctx } from "@budibase/types"

export const get = async (ctx: Ctx) => {
  ctx.body = [{ ok: true }]
}
