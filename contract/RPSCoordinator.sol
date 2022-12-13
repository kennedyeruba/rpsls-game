// SPDX-License-Identifier: MIT

/*
 *   @title Game Coordinator
 *   @author Kennedy Eruba
*/

pragma solidity >=0.7.0 <0.9.0;

contract RPSCoordinator {

    mapping(string => Game) internal games;

    enum GameStatus {Null, Started, InProgess, Ended}

    struct Game {
        address playerOne;
        address playerTwo;
        GameStatus status;
    }

    event Joined(string gameID, address starter, address joiner);
    event Started(string gameID, address starter);
    event Moved(address player);
    event Ended(string gameID);

    function startGame(string memory gameID) external {
        require(games[gameID].status == GameStatus.Null, "Game ID already exists");

        games[gameID].status = GameStatus.Started;
        games[gameID].playerOne = msg.sender;

        emit Started(gameID, msg.sender);
    }

    function getGameStatus(string memory gameID) external view returns(GameStatus status) {
        return games[gameID].status;
    }

    function joinGame(string memory gameID) external {
        require(games[gameID].status == GameStatus.Started, "Game is not active");
        require(games[gameID].playerOne != msg.sender, "Starter can't be joiner, use different address");

        games[gameID].status = GameStatus.InProgess;
        games[gameID].playerTwo = msg.sender;

        emit Joined(gameID, games[gameID].playerOne, msg.sender);
    }

    function makeMove() external {
        emit Moved(msg.sender);
    }

    function endGame(string memory gameID) external {
        require(games[gameID].status == GameStatus.InProgess, "Game not in progress");

        games[gameID].status = GameStatus.Ended;
        emit Ended(gameID);
    }

}