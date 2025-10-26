const { Op } = require('sequelize');
const { Player } = require('../models');

exports.getAllPlayers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      long_name,
      club_name,
      player_positions,
      sortBy = 'long_name',
      sortDir = 'ASC'
    } = req.query;

    const where = {};
    if (long_name) where.long_name = { [Op.like]: `%${long_name}%` };
    if (club_name) where.club_name = { [Op.like]: `%${club_name}%` };
    if (player_positions) where.player_positions = { [Op.like]: `%${player_positions}%` };

    const pageInt = Math.max(1, parseInt(page, 10));
    const limitInt = Math.max(1, parseInt(limit, 10));
    const offset = (pageInt - 1) * limitInt;

    const order = [[sortBy, sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']];

    // Evitar cache en datos dinámicos
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    const { count, rows } = await Player.findAndCountAll({
      where,
      limit: limitInt,
      offset,
      order
    });

    return res.json({
      rows,
      count,
      page: pageInt,
      totalPages: Math.max(1, Math.ceil(count / limitInt))
    });
  } catch (err) {
    console.error('getAllPlayers error', err);
    return res.status(500).json({ error: err.message });
  }
};
// GET /api/players/download
exports.downloadPlayers = async (req, res) => {
  try {
    const { long_name, club_name, player_positions } = req.query;
    const where = {};
    if (long_name) where.long_name = { [Op.like]: `%${long_name}%` };
    if (club_name) where.club_name = { [Op.like]: `%${club_name}%` };
    if (player_positions) where.player_positions = { [Op.like]: `%${player_positions}%` };

    const players = await Player.findAll({ where, raw: true });

    if (!players || players.length === 0) {
      return res.status(204).send(); // no content
    }
    const columns = Object.keys(players[0]);
    const csvRows = [
      columns.join(','), // encabezado
      ...players.map(p => columns.map(c => {
        const v = p[c] === null || p[c] === undefined ? '' : String(p[c]);
        return `"${v.replace(/"/g, '""')}"`;
      }).join(','))
    ];
    const csv = csvRows.join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="players.csv"');
    res.send(csv);
  } catch (err) {
    console.error('downloadPlayers error', err);
    res.status(500).json({ error: err.message });
  }
};

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