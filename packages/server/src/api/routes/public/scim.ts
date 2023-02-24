import * as userController from "../../controllers/public/scim/users"
import Endpoint from "./utils/Endpoint"

const read = [],
  write = []

read.push(new Endpoint("get", "/scim/v2", userController.get))

export default { read, write }
