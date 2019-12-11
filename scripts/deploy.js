/* eslint-disable no-console */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
const prompt = require('prompt');
const colors = require("colors/safe");
const { exec } = require("child_process");
const path = require('path');
const node_ssh = require('node-ssh')

const ssh = new node_ssh()
const targetDir = process.env.RELEVANT_PATH
//
// Setting these properties customizes the prompt.
//
prompt.message = colors.green("require");
const schema = {
    properties: {
        host: {
            description: "remote host",
            pattern: /(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/,
            message: 'Invalid ip',
            require: true
        },
        userName: {
            description: "remote username",
            default: "root",
            require: true
        },
        remotePath: {
            description: 'remote Path',
            pattern: /^\/(.+\/?)+$/,
            message: 'Invalid path',
            default: "/var/www/makkii-dev/makkii-js",
            require: true
        },
        password: {
            hidden: true
        }
    }
}
prompt.start();
prompt.get(schema, (err, result) => {
    console.log('Command-line input received:');
    console.log(`  host: ${result.host}`);
    console.log(`  userName: ${result.userName}`);
    console.log(`  remotePath: ${result.remotePath}`);
    console.log(`${colors.green('=============== try to pack html ====================')}`)
    exec('tar -czvf apidoc.tar.gz html', (err1) => {
        if (err1) {
            console.log("Something's wrong")
            console.log(err1)
            return;
        }
        console.log('   pack apidoc ok')
        console.log(`${colors.green('=============== try to connect to remote ==============')}`)
        const config = {
            host: result.host,
            username: result.userName,
            password: result.password,
            tryKeyboard: true,
            onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
                if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
                    finish([result.password])
                }
            }
        };
        ssh.connect(config).then(() => {
            console.log('   connect Ok')
            const localPath = path.resolve(__dirname, '../apidoc.tar.gz');
            const remotePath = `${result.remotePath}/apidoc.tar.gz`;
            console.log(`${colors.green('=============== try to upload apidoc.tar.gz ================')}`)
            console.log(`  localPath: ${localPath}`);
            console.log(`  remotePath: ${remotePath}`);
            ssh.putFile(localPath, remotePath).then(() => {
                console.log("   upload ok")
                console.log(`${colors.green('=============== try to unpack apidoc.tar.gz ==============')}`)
                ssh.execCommand(`rm -rf ${targetDir}; tar -xzvf apidoc.tar.gz; mv html ${targetDir}; rm apidoc.tar.gz`, { cwd: result.remotePath }).then(r => {
                    if (r.stderr) {
                        console.log("   Something's wrong")
                        console.log(r.stderr)

                    } else {
                        console.log(`${r.stdout}`)
                        console.log(colors.green('deploy success!'))
                    }
                    ssh.dispose();
                })
            }).catch(e => {
                console.log("   Something's wrong")
                console.log(e)
                ssh.dispose();
            })
        }).catch(e => {
            console.log("   Something's wrong")
            console.log(e)
        })
    })
})