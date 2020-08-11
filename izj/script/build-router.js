const Generator = require('yeoman-generator')
// const mkdirp = require('mkdirp')
const yosay = require('yosay')
const chalk = require('chalk')
const cli = require('./cli')
module.exports = class extends Generator {
  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts)
    // this.argument('appname', { type: String, required: true })

    // And you can then accstartess it later; e.g.
    this.log('')
  }
  initializing() {
    const message = chalk.bgBlack.bold('\n开始添加router\n')
    this.log(yosay(message))
  }
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'url',
        message: '请输入router的Url',
        default: this.name
      }, {
        type: 'input',
        name: 'isMenu',
        message: '请输入菜单名称(如果不出现在菜单请写 hide)？',
        default: this.name
      }]
    ).then(answers => {
      this.log('router', JSON.stringify(answers))
      console.log(cli.add([answers.url, answers.isMenu]))
    })
  }
}
