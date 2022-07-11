import { Order } from "../types";

export const minSellPrice = (orderBook: Order[]) => {
  const sellList = orderBook.filter((order) => {
    return order.side === 'Sell';
  });

  sellList.sort((a,b)=>{
    return a.price - b.price
  })

  return sellList[0].price;
};

export const maxBuyPrice = (orderBook: Order[]) => {
  const buyList = orderBook.filter((order) => {
    return order.side === 'Buy';
  });

  buyList.sort((a,b)=>{
    return b.price - a.price
  })

  return buyList[0].price;
};
