
function getNegsCount(board, rowIdx, colIdx, strPar) {
      var count = 0
      for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue

            for (let j = colIdx - 1; j <= colIdx + 1; j++) {
                  if (j < 0 || j >= gBoard[i].length) continue
                  if (i === rowIdx && j === colIdx) continue

                  if (board[i][j][`${strPar}`]) count++
            }
      }
      return count
}




function getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
