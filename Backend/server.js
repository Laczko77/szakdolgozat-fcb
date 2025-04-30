const express = require('express');
// Az Express.js keretrendszer importálása HTTP szerver létrehozásához.

const mongoose = require('mongoose');
// A Mongoose importálása az adatbázis kezeléséhez.

const cors = require('cors');
// A CORS middleware importálása, amely lehetővé teszi a különböző portok közötti kommunikációt
// (pl. frontend és backend között).

const bodyParser = require('body-parser');
// A body-parser importálása, amely a POST kérésekben küldött adatok feldolgozását segíti.
// (Az express.json() már helyettesíti ezt, így használata opcionális.)

const authRoutes = require('./routes/authRoutes');
// Az `authRoutes` importálása, amely az autentikációhoz kapcsolódó végpontokat tartalmazza.

// MongoDB kapcsolódás
mongoose.connect('mongodb://localhost:27017/Szakdolgozat')
// Kapcsolódás a helyi MongoDB adatbázishoz, a `Szakdolgozat` nevű adatbázisba.
  .then(() => console.log('MongoDB connected'))
  // Ha a kapcsolat sikeres, megjelenik egy üzenet a konzolon.
  .catch(err => console.log('MongoDB connection error: ', err));
  // Ha hiba történik a kapcsolódás során, a hibát kiírja a konzolra.

const app = express();
// Az Express alkalmazás példányosítása.

const port = 3000;
// A szerver portját 3000-re állítjuk.


// Middleware-ek
app.use(cors());
// A CORS middleware engedélyezése, hogy a frontend és backend külön porton kommunikálhasson.

app.use(express.json());
// Middleware a bejövő kérések JSON formátumban történő automatikus feldolgozására.

// Az authRoutes beillesztése

app.use('/api/users', authRoutes);
// A `/api/users` útvonalat az `authRoutes`-hoz rendeljük. Ez azt jelenti, hogy az
// `authRoutes`-ban definiált végpontok elérhetők például `/api/users/register` alatt.

// Alap route
app.get('/', (req, res) => {
  res.send('Backend is running');
});
// Az alapértelmezett route, amely egy egyszerű üzenetet küld vissza, hogy jelezze,
// a szerver fut. Ez tesztelésre használható. 

const newsRoutes = require('./routes/newsRoutes');
app.use('/api/news', newsRoutes);
app.use('/uploads/news', express.static('uploads/news'));
/*app.use('/api/news', require('./routes/newsRoutes'));*/

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
app.use('/uploads/products', express.static('uploads/products'));


const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);


const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);


const matchRoutes = require('./routes/matchRoutes');
app.use('/api/matches', matchRoutes);


const playerRoutes = require('./routes/playerRoutes');
app.use('/api/players', playerRoutes);
app.use('/uploads/players', express.static('uploads/players'));

const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);


const forumRoutes = require('./routes/forumRoutes');
app.use('/api/forum', forumRoutes);
app.use('/uploads/forum', express.static('uploads/forum'));


const pollRoutes = require('./routes/pollRoutes');
app.use('/api/poll', pollRoutes);


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// A szerver elindítása a 3000-es porton. A konzolon megjelenik egy üzenet a sikeres induláskor.
