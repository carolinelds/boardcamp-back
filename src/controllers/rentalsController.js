import db from "./../db.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    const filterCustomer = req.query.customerId;
    const filterGame = req.query.gameId;

    try {

        let query, values;
        if (!filterCustomer && !filterGame) {
            query = `
                SELECT rentals.* FROM rentals
            `;
            values = [];

        } else if (filterCustomer && filterGame) {
            query = `
                SELECT rentals.* FROM rentals
                WHERE 
                    rentals."customerId" = $1 AND
                    rentals."gameId" = $2   
            `;
            values = [filterCustomer, filterGame];

        } else if (filterGame) {
            query = `
                SELECT rentals.* FROM rentals
                WHERE 
                    rentals."gameId" = $1   
            `;
            values = [filterGame];

        } else if (filterCustomer) {
            query = `
                SELECT rentals.* FROM rentals
                WHERE 
                    rentals."customerId" = $1
            `;
            values = [filterCustomer];
        }

        const rentalsResult = await db.query(query, values);
        const rentals = rentalsResult.rows;

        let finalRentals = [];
        for (let rental of rentals) {
            const queryCustomer = `
                SELECT customers.id, customers.name
                FROM customers
                WHERE customers.id = $1
            `;
            const valuesCustomer = [rental.customerId];
            const customerResult = await db.query(queryCustomer, valuesCustomer);
            const customer = customerResult.rows[0];

            const queryGame = `
                SELECT games.id, games.name, 
                       categories.id as "categoryId", categories.name as "categoryName"
                FROM games
                JOIN categories
                ON games."categoryId" = categories.id
                WHERE games.id = $1
           `;
            const valuesGame = [rental.gameId];
            const gameResult = await db.query(queryGame, valuesGame);
            const game = gameResult.rows[0];

            finalRentals.push({ ...rental, customer, game });
        }

        res.send(finalRentals);

    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter os dados da transação.");
    }
}

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const today = dayjs().format('YYYY-MM-DD');

    try {
        const queryPrice = `
            SELECT games."pricePerDay" as price 
            FROM games
            WHERE games.id = $1
        `;
        const valuesPrice = [gameId];
        const priceResult = await db.query(queryPrice,valuesPrice);
        const totalPrice = priceResult.rows[0].price * daysRented;

        const queryNewRental = `
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const valuesNewRental = [
            customerId,
            gameId,
            today,
            daysRented,
            null,
            totalPrice,
            null
        ];
        await db.query(queryNewRental, valuesNewRental);

        res.sendStatus(201);

    } catch(e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro nessa transação.");
    }
}

export async function closeRental(req, res) {
    const { id } = req.params;

    try {

        const queryRental = `
            SELECT rentals."rentDate", rentals."gameId" FROM rentals
            WHERE rentals.id = $1
        `;
        const valuesRental = [id];
        const rentalResult = await db.query(queryRental, valuesRental);
        const rentDate = rentalResult.rows[0].rentDate;
        const gameId = rentalResult.rows[0].gameId;

        const queryGamePrice = `
            SELECT games."pricePerDay" FROM games
            WHERE games.id = ${gameId}
        `;
        const gamePriceResult = await db.query(queryGamePrice);
        const pricePerDay = gamePriceResult.rows[0].pricePerDay;

        const todayFormatted = dayjs().format('YYYY-MM-DD');
        const today = dayjs();
        const delayedDays = today.diff(rentDate, 'day');
        const delayFee = pricePerDay * delayedDays;

        const queryUpdate = `
            UPDATE rentals
            SET
                "returnDate" = '${todayFormatted}',
                "delayFee" = ${delayFee}
            WHERE id = $1
        `;
        const valuesUpdate = [id];
        await db.query(queryUpdate,valuesUpdate);

        res.sendStatus(200);
    
    } catch(e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro nessa transação.");
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        const query = `
            DELETE FROM rentals
            WHERE id = $1 
        `;
        const values = [id];
        await db.query(query, values);

        res.sendStatus(200);

    } catch(e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro nessa transação.");
    }
}