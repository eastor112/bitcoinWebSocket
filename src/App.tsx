import React, { useEffect } from 'react';
import { useState } from 'react';
import { Order } from './types';
import { maxBuyPrice, minSellPrice } from './utils/utils';

const App = () => {
  const [orderBook, setOrderBook] = useState<Order[]>([]);

  useEffect(() => {
    const socket = new WebSocket('wss://ws.bitmex.com/realtime');

    let ordersList: Order[] = [];

    socket.onopen = (e) => {
      socket.send(
        JSON.stringify({ op: 'subscribe', args: ['orderBookL2_25:XBTUSD'] })
      );
    };

    socket.onmessage = (event) => {
      const { action, data } = JSON.parse(event.data);

      if (action === 'partial') {
        console.log('todos los datos');
        ordersList = data;
      }

      if (action === 'update') {
        data.forEach((commingOrder: Order) => {
          ordersList = ordersList.map((existingOrder: Order) => {
            if (existingOrder.id === commingOrder.id) {
              existingOrder.side = commingOrder.side;
              existingOrder.size = commingOrder.size;
              existingOrder.timestamp = commingOrder.timestamp;
            }

            return existingOrder;
          });
        });
      }

      if (action === 'delete') {
        data.forEach((commingOrder: Order) => {
          ordersList = ordersList.filter((existingOrder) => {
            return existingOrder.id !== commingOrder.id;
          });
        });
      }

      if (action === 'insert') {
        ordersList = ordersList.concat(data);
      }

      setOrderBook(ordersList);
    };

    return () => socket.close(1000, 'bye');
  }, []);

  return (
    <div>
      <h3>BITCOIN APP</h3>
      <hr />
      <div style={styles.container}>
        <p style={styles.tags}>
          Max Buy Price: USD
          <span style={styles.prices}>
            {orderBook.length > 0 && maxBuyPrice(orderBook)}
          </span>
        </p>
        <p style={styles.tags}>
          Min Sell Price: USD
          <span style={styles.prices}>
            {orderBook.length > 0 && minSellPrice(orderBook)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default App;

const styles: { [data: string]: React.CSSProperties } = {
  container: {
    width: '300px',
    border: '1px solid black',
    padding: '20px',
    borderRadius: '10px',
  },
  tags: {
    fontWeight: 'bold',
    fontSize: '20px',
  },
  prices: {
    marginLeft: '20px',
  },
};
