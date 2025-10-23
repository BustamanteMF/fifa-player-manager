const { Player } = require('../models');
const { Op } = require('sequelize');
const XLSX = require('xlsx');

// GET api/players
exports.getAllPlayers = async (req, res) => {
    try {
        const { name, position, club } = req.query;
        const where = {};
        if (name) where.long_name = { [Op.like]: `%${name}%` };
        if (position) where.player_positions = { [Op.like]: `%${position}%` };
        if (club) where.club_name = { [Op.like]: `%${club}%` };

        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
        
        const players = await Player.findAll({ where, limit, offset });
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// GET /api/players/download
exports.downloadPlayers = async (req, res) => {
    try {
        const { name, club, position } = req.query;
        const where = {};
        if (name) where.long_name = { [Op.like]: `%${name}%` };
        if (club) where.club_name = { [Op.like]: `%${club}%` };
        if (position) where.player_positions = { [Op.like]: `%${position}%` };
        const players = await Player.findAll({where});
        
        const data = players.map(p => p.toJSON());
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Players');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        res.setHeader('Content-Disposition', 'attachment; filename=players.xlsx');
        res.send(Buffer.from(excelBuffer));
    } catch (error) {
        console.error('Error downloading players:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// GET api/players/:id
exports.getPlayerById = async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.id);
        if (!player) return res.status(404).json({ message: 'Player not found'});
        res.json(player);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting player'});
    }
};
//  PUT /api/players/:id
exports.updatePlayer = async (req, res) => {
    try {
        const [updated] = await Player.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json({ message: 'Player updated successfully' });
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// POST /api/players
exports.createPlayer = async (req, res) => {
    try {
        const newPlayer = await Player.create(req.body);
        res.status(201).json(newPlayer);
    } catch (error) {
        console.error('Error creating player:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};