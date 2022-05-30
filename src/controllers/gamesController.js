import db from "./../db.js";

export async function getGames(req,res){
    const filterString = req.query.name;
    
    try {
        if (filterString){
            const query = `
                SELECT games.*, categories.name AS "categoryName"  
                FROM games
                JOIN categories ON games."categoryId"=categories.id
                WHERE LOWER(games.name) LIKE '$1%'
            `;
            const values = [filterString.toLowerCase()];
            const games = await db.query(query,values);

            res.send(games.rows);

        } else {
            const query = `
                SELECT games.* 
                FROM games
                JOIN categories ON games."categoryId"=categories.id
            `;
            const games = await db.query(query);

            res.send(games.rows);
        }
    } catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter os jogos!");
    }
}