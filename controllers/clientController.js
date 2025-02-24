const knex = require('../config/database'); // Assuming you have configured Knex.js

async function createSubClient(req, res) {
    const {
        user_id,
        firstname,
        middlename,
        lastname,
        profile_image,
        sex,
        birth_date,
        weight,
        height,
        client_type,
        phy_con,
        con_dis,
        drug_all,
        drug_used,
        is_term
    } = req.body;

    // Start a transaction
    const trx = await knex.transaction();

    try {
        // Step 1: Update the role in the User table to "client"
        await trx('Users')
            .where({ user_id: user_id })
            .update({ role: 'client' });

        // Step 2: Insert into the Client table and get the client_id
        const [client] = await trx('Client')
            .insert({ user_id })
            .returning('client_id'); // PostgreSQL returns the inserted ID(s)

        const client_id = client.client_id; // Extract the UUID from the returned object
        
        // Step 3: Insert into the SubClient table
        await trx('SubClient').insert({
            client_id,
            firstname,
            middlename,
            lastname,
            profile_image,
            sex,
            birth_date,
            weight,
            height,
            client_type,
            phy_con,
            con_dis,
            drug_all,
            drug_used,
            is_term
        });

        // Commit the transaction
        await trx.commit();

        // Send a success response
        res.status(201).json({ message: 'SubClient created successfully', client_id });
    } catch (error) {
        // Rollback the transaction in case of error
        await trx.rollback();
        console.error('Error creating SubClient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { createSubClient };