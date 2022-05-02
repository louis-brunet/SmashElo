/**
 * Expected probabilty for player A to win given ratings Ra, Rb
 * Ea = 1 / ( 1 + 10^( (Rb-Ra) / 400) )
 * 
 * New rating for player A. 
 * Ra' = Ra + K * (Sa - Ea)
 * 
 * Sa is A's result (1 for W, 0 for L).
 * K is a constant that determines rating variance.
 */


const DEFAULT_ELO = 1200
const K_VARIANCE = 32
const EXP_BASE = 10
const SCALE_FACTOR = 400

const computeMatchResult = (elo1, elo2, score1, score2) => {
    score1 = parseInt(score1, 10)
    score2 = parseInt(score2, 10)
    const result1 = score1 > score2 ? 1 : score2 > score1 ? 0 : 0.5
    const result2 = 1 - result1
    const { expected1, expected2 } = playersExpectedProbability(elo1, elo2)
    console.log(`expected1 = ${expected1}`);
    const { newElo: newElo1, change: change1 } = computeNewElo(elo1, result1, expected1)
    const { newElo: newElo2, change: change2 } = computeNewElo(elo2, result2, expected2)
    console.log(`match result 1(elo, change) = ${newElo1}, ${change1}`);
    return {
        newElo1,
        change1,
        newElo2,
        change2
    }
}

const computeNewElo = (elo, result, expected) => {
    console.log(`result - expected = ${result-expected}`);
    console.log(`k * (result - expected) = ${K_VARIANCE * (result-expected)}`);
    const change = Math.round(K_VARIANCE * (result - expected))
    return {
        newElo: elo + change,
        change
    }
}

const playersExpectedProbability = (elo1, elo2) => {
    const diff1 = elo2 - elo1
    const diff2 = elo1 - elo2

    return {
        expected1: expectedProbability(diff1),
        expected2: expectedProbability(diff2),
    }
}

const expectedProbability = (ratingDiff) => {
    const exponent = ratingDiff / SCALE_FACTOR
    return 1 / (1 + Math.pow(EXP_BASE, exponent))
}


module.exports = {
    DEFAULT_ELO,
    computeMatchResult
}