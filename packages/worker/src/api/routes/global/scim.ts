import Router from "@koa/router"
import * as userController from "../../controllers/global/scim/users"
import { auth } from "@budibase/backend-core"

const router: Router = new Router()

router.get("/api/global/scim/v2/users", userController.get)

export default router
