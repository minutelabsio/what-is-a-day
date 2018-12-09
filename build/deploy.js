const ghpages = require('gh-pages')
const chalk = require('chalk')
const ora = require('ora')
const path = require('path')
const config = require('../config')

const spinner = ora('deploying to github pages...')
spinner.start()
ghpages.publish(config.build.assetsRoot, function(err) {
  spinner.stop()
  if (err) {
    console.error(err)
    return
  }


  console.log(chalk.cyan('  Deployed to github pages.\n'))
});
