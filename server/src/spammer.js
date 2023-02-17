const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
  setInterval(() => {
    const shelfId = Math.floor(Math.random() * 5);
    const payload = { shelf_id: shelfId };
    const body = JSON.stringify(payload);

    client.publish('light_shelf', body)
    console.log(`spamuje bo moge: ${body}`);
  }, 5000)
})

