require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.get('/', (req, res) => {
    res.send('Servidor XP Online y conectado a la Nube ☁️');
});

app.get('/api/guestbook', async (req, res) => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.post('/api/guestbook', async (req, res) => {
    const { name, message } = req.body;

    // Validación simple
    if (!name || !message) {
        return res.status(400).json({ error: 'Nombre y mensaje son obligatorios' });
    }

    const { data, error } = await supabase
        .from('messages')
        .insert([
            { name: name, message: message }
        ])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json({ success: true, data: data });
});

app.listen(PORT, () => {
    console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
});