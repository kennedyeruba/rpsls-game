const parseOutcome = _outcome => {
    switch(_outcome) {
      case 1:
        return 'Player 1 won';
      case 2:
        return 'Player 2 won';
      case 3:
        return 'Tie';
    }
}

export default parseOutcome;