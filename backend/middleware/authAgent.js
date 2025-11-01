const AGENT_API_KEY = process.env.AGENT_API_KEY;

function authAgent(req, res, next) {
    const apiKey = req.get('X-API-Key');
    if (!apiKey || apiKey !== AGENT_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

module.exports = authAgent;
