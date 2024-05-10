import os from 'os';

export const performOsInfo = async (args) => {
  const validArgs = ['--EOL', '--cpus', '--homedir', '--username', '--architecture'];
  if (args.length !== 1 || !validArgs.includes(args[0])) {
    console.log('Invalid input. Usage: os --EOL, os --cpus, os --homedir, os --username, os --architecture');
    return;
  }

  switch (args[0]) {
    case '--EOL':
      console.log(JSON.stringify(os.EOL));
      break;
    case '--cpus':
      console.log(`Total CPUs: ${os.cpus().length}`);
      os.cpus().forEach(({ model, speed }, index) => console.log(`CPU ${index}: ${model} at ${speed}MHz`));
      break;
    case '--homedir':
      console.log(os.homedir());
      break;
    case '--username':
      console.log(os.userInfo().username);
      break;
    case '--architecture':
      console.log(os.arch());
      break;
  }
};