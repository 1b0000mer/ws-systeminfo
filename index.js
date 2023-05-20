import si from 'systeminformation';
import { WebSocketServer } from 'ws';

const port = 4444;
const wss = new WebSocketServer({ port: port });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send CPU load data every second
  const intervalId = setInterval(async () => {
    try {
      const data = await si.currentLoad();
      const cpuLoads = data.cpus.map((cpu) => cpu.load);

      // Send CPU load data to the connected client
      ws.send(JSON.stringify(cpuLoads));
    } catch (error) {
      console.error('Error sending CPU load data:', error);
    }
  }, 1000);

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});

console.log(`WebSocket server started on port ${port}`);