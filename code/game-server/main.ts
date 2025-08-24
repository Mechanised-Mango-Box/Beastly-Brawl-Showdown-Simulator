import { log_notice, log_attention } from "../shared/utils";
import { run, ServerConfig } from "./server";

//#region TEMP
log_notice("Loading config...");
log_attention("Config not implemented yet. Using placeholder.");
const tempConfig: ServerConfig = {
  serverIp: "http://localhost",
  serverPort: 8080,
  serverNumber: 7,
  maxCapcity: 12,
  overrideExistingRecordOnStartup: true,
};
log_notice("Config loaded.");
//#endregion

//#region Start
run(tempConfig);
//#endregion
