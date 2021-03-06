/* global danger */
// http://danger.systems/js/tutorials/dependencies.html
var includes = require('lodash.includes')

function checkYarnLock (callback) {
  callback = callback || function () {}
  return new Promise(function (resolve, reject) {
    danger.git.JSONDiffForFile('package.json')
      .then(function (packageDiff) {
        var hasDependencyChanges = !!(packageDiff.dependencies || packageDiff.devDependencies)

        if (hasDependencyChanges) {
          var hasLockfileChanges = includes(danger.git.modified_files, 'yarn.lock')
          if (!hasLockfileChanges) {
            var message = 'There are "package.json" dependency changes with no "yarn.lock" changes'
            callback(null, message)
            resolve(message)
          } else {
            callback()
            resolve()
          }
        } else {
          callback()
          resolve()
        }
      })
      .catch(function (err) {
        callback(err)
        reject(err)
      })
  })
}

module.exports = checkYarnLock
