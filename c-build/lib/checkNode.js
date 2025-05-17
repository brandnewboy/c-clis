const semver = require('semver')

const checkNode = (minNodeVersion) => {
    // x.y.z
    // major.minor.patch

    // console.log(semver.valid('v1.0.0'))
    // console.log(semver.valid('1.0.0'))
    // console.log(semver.clean(' v1.0.0 '))
    // console.log(semver.clean(' =v1.0.0 '))
    // console.log(semver.clean(' ^v1.0.0 ')) // × null
    // console.log(semver.clean(' ~v1.0.0 ')) // × null
    // console.log(semver.satisfies('1.0.1', '1.x || <1.1.0'))
    // console.log(semver.validRange( '5.0.0 - 7.2.3'))
    // console.log(semver.satisfies( '8.1.2', semver.validRange( '5.0.0 - 7.2.3')))
    // console.log(semver.gt('8.0.1', '11.0.0'))
    // console.log(semver.lt('8.0.1', '11.0.0'))

    const nodeVersion = semver.valid(semver.coerce(process.version))
    console.log(nodeVersion, minNodeVersion)
    return semver.satisfies(nodeVersion, '>=' + minNodeVersion)
}

module.exports = {
    checkNode
}