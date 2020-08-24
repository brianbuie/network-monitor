import chalk from "chalk";
import { format } from "date-fns";

const timestamp = () => {
  const d = new Date();
  return `[${format(d, "MM/dd HH:mm:ss.SSS")}] \t`;
};

const success = (text) => console.log(timestamp() + chalk.green(text));

const warn = (text) => console.log(timestamp() + chalk.yellow(text));

const info = (text) => console.log(timestamp() + chalk.cyan(text));

const plain = (text) => console.log(timestamp() + text);

const danger = (text) => console.log(timestamp() + chalk.red(text));

export default { success, warn, info, plain, danger };
