const fs = require('fs')
const getFiles = (path, suffix) => {
    return fs.readdirSync(path).filter(f=>f.endsWith(suffix))
}

const didBothPlayersValidateResult = (tag1, tag2, message, emoteName) => {
    // if (message.reactions.cache.size < 2) {
    //     return false
    // }

    // console.log('reactions.cache.size = ', messagereactions.cache.size);

    // const has1Validated = message.reactions.cache.find(r => 
    let bothValidated = !! message.reactions.cache.find(r => 
        r.emoji.name === emoteName 
        && r.users.cache.find(u => tag1 === u.tag.toLowerCase())
        && r.users.cache.find(u => tag2 === u.tag.toLowerCase())
    )

    return bothValidated
}

const RESULT_LINE_PATTERN = /^.{3,32}#[0-9]{4} +[0-9]+ +\[[0-9]+ -> [0-9]+/
const parseResultValidationMessage = (message) => {
    const tags = []
    const newElos = []
    const scores = []

    const lines = message.content.split('\n')

    lines.forEach(line => {
        let isResultLine = false
        line.match(/^.{3,32}#[0-9]{4}/)?.forEach(tag => tags.push(tag.toLowerCase()))
        line.match(RESULT_LINE_PATTERN)?.forEach(match => {
            const newElo = parseInt(match.split(' ').at(-1), 10)
            newElos.push(newElo)
            isResultLine = true
        })

        if (isResultLine) {
            const match = line.match(/^.{3,32}#[0-9]{4} +[0-9]+/)?.[0]
            if (match) {
                const score = parseInt(match.split(' ').at(-1), 10)
                scores.push(score)
            }
        }
        
    })

    if (tags.length < 2) {
        console.error('messageReactionAdd.parseMessage : could not find at least 2 tags')
        return undefined
    }

    if (newElos.length < 2) {
        console.error('messageReactionAdd.parseMessage : could not find at least 2 new elos')
        return undefined
    }

    if (scores.length < 2) {
        console.error('messageReactionAdd.parseMessage : could not find at least 2 scores')
        return undefined
    }

    return {
        tag1: tags[0],
        tag2: tags[1],
        newElo1: newElos[0],
        newElo2: newElos[1],
        isWin1: scores[0] > scores[1],
        isDraw: scores[0] === scores [1]
    }
}
module.exports = {
    getFiles,
    didBothPlayersValidateResult,
    parseResultValidationMessage
}