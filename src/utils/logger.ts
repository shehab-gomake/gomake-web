import log from "loglevel";

log.setLevel("info");

export default log;

// import log, { LogLevelNames, LogLevelNumbers } from "loglevel";
// import { addRequestToSession } from "./sessionManager";

// const logPlugin = {
//   name: "sessionLogger",
//   level: log.levels.DEBUG,
//   methodFactory: (methodName: LogLevelNames, level: LogLevelNumbers, loggerName: string) => {
//     const rawMethod = log.methodFactory(methodName, level, loggerName);

//     return (...message: any[]) => {
//       addRequestToSession({ methodName, message });
//       rawMethod(...message);
//     };
//   },
// };

// log.methodFactory = logPlugin.methodFactory;
// log.setLevel(logPlugin.level);

// export default log;
