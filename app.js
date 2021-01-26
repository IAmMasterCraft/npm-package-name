const wrapper = require("simple-api-wrapper");
const prompt = require("prompt");
const colors = require("colors/safe");

prompt.start();

const intro = () => {
    console.log(
        colors.green(
            `
            *****************************************************************************************************\n
            *****************************************************************************************************\n
            This CLI tool is pretty easy and simple to use\n
            BUT....\n
            if you see anything that looks like:\n
            'connect ETIMEDOUT'\n
            it signifies connection timeout and the check was not completed successfully\n
            But if it is something like:\n
            'Request failed with status code 404'\n
            Then that's a good news, package name is available!\n
            *****************************************************************************************************\n
            *****************************************************************************************************\n\n\n\n\n\n\n
            `
        )
    );
}

const handleError = (error) => {
    console.log(error.message);
    return 1;
}

const retry = () => {
    console.log(colors.yellow.underline("Try again?"));
    prompt.get(['restart'], (err, result) => {
        if (err) { return handleError(err); }
        // console.log(colors.green('Input received . . .'));
        if (result.restart.toLowerCase().includes("y"))
            startTool();
        else
            console.log(colors.red.bold("Shutting down . . ."));
    });
}

const checkName = (name) => {
    //endpoints and data
    const config = {
            get: [
                    {
                        [`https://registry.npmjs.org/${name}`]: {},
                    }
                ],
            };

    const allResponse = wrapper.apiWrapper(config);
    allResponse.then(result => {
        if (result) {
            console.log(colors.green(`${colors.red.bold.underline(name)} cannot be used as node package name cos it already exist`));
            retry();
        }
        else {
            console.log(colors.green(`${name} might still available, ${colors.red.bold.underline('npm publish')} that package ${colors.bold('NOW ! ! ! ')}`))
            retry();
        }
    });
}

const startTool = () => {
    console.log(colors.green("Welcome!\nPlease enter the name you want to check"));
    prompt.get(['packageName'], (err, result) => {
        if (err) { return handleError(err); }
        // console.log(colors.green('Input received . . .'));
        console.log(colors.green(`Checking for the availability of ${colors.yellow.bold.underline(result.packageName)} . . .`));
        checkName(result.packageName.replace(/ /g, "-"));
    });
}

intro();
startTool();