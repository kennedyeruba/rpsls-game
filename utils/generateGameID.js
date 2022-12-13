
const generateGameID = () => {
    const alphaNumerics = ['A','B','C','D','E','F',0,1,2,3,4,5,6,7,8,9];
    let id = '';
    for(let idx = 0; idx < 6; idx++) {
        id += alphaNumerics[Math.floor(Math.random() * alphaNumerics.length)];
    }
    return id;
}

export default generateGameID;