const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.send(`
    <h1>Willkommen zur Bestellungsverwaltung</h1>
    <p>Bitte wählen Sie eine Option:</p>
    <ul>
      <li><a href="/chef">Zur Kochseite</a></li>
      <li><a href="/guest">Zur Gastseite</a></li>
    </ul>
  `);
});

app.get('/chef', (req, res) => {
  // Hier können Sie den Inhalt der Chefseite bereitstellen
  res.sendFile(__dirname + '/chef.html');
});

app.get('/guest', (req, res) => {
  // Hier können Sie den Inhalt der Gastseite bereitstellen
  res.sendFile(__dirname + '/guest.html');
});

let nextOrderId = 1; // Variable für die nächste Bestellungs-ID
const orders = []; // Speichert alle Bestellungen

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.post('/order', (req, res) => {
  const order = req.body;
  order.id = nextOrderId;
  order.done = false;
  nextOrderId++;
  orders.push(order);

  res.json({ message: 'Bestellung erhalten' });
});

app.post('/markAsDone', (req, res) => {
  const orderId = req.body.order;

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].id === orderId) {
      orders[i].done = true;
      break;
    }
  }

  res.json({ message: 'Bestellung als erledigt markiert' });
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
