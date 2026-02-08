import chalk from 'chalk';

interface ErrorType {
  error: unknown;
  functionName: string;
  handler: 'db' | 'controller' | 'middleware' | 'util';
}

const isError = ({ error, functionName, handler }: ErrorType) => {
  if (error instanceof Error) {
    console.error(
      chalk.red(`Error on ${functionName} ${handler}: ${error.message}`)
    );
  } else {
    console.error(
      chalk.bgRed(`Unexpected error on ${functionName} ${handler}: ${error}`)
    );
  }
};

export default isError;
