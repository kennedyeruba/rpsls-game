const parseMove = _move => {
    switch(_move) {
        case 'rock':
            return 1;
        case 'paper':
            return 2;
        case 'scissors':
            return 3;
        case 'spock':
            return 4;
        case 'lizard':
            return 5;
    }
}

export default parseMove;