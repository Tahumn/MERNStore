jest.mock('../../models/product', () => ({
  bulkWrite: jest.fn()
}));

const store = require('../../utils/store');

describe('store utils', () => {
  test('calculates sales tax per cart item', () => {
    const items = [
      { product: '1', price: 100, quantity: 2, taxable: true },
      { product: '2', price: 50, quantity: 1, taxable: false }
    ];

    const result = store.caculateItemsSalesTax(items);

    expect(result[0]).toMatchObject({
      totalPrice: 200,
      totalTax: 10,
      priceWithTax: 210
    });
    expect(result[1]).toMatchObject({
      totalPrice: 50,
      totalTax: 0,
      priceWithTax: 0
    });
  });

  test('calculates order total excluding cancelled items', () => {
    const order = {
      products: [
        { totalPrice: 100, status: 'Processing' },
        { totalPrice: 30, status: 'Cancelled' },
        { totalPrice: 20, status: 'Delivered' }
      ]
    };

    const total = store.caculateOrderTotal(order);

    expect(total).toBe(120);
  });

  test('calculates order tax amount & updates totals', () => {
    const order = {
      total: 0,
      totalTax: 0,
      products: [
        {
          quantity: 1,
          status: 'Processing',
          product: { price: 100, taxable: true },
          totalTax: 0,
          priceWithTax: 0
        },
        {
          quantity: 1,
          status: 'Cancelled',
          product: { price: 50, taxable: true },
          totalTax: 0,
          priceWithTax: 0
        }
      ]
    };

    const result = store.caculateTaxAmount(order);

    expect(result.total).toBe(100);
    expect(result.totalTax).toBeCloseTo(5);
    expect(result.totalWithTax).toBeCloseTo(105);
    expect(result.products[0].priceWithTax).toBeCloseTo(105);
    expect(result.products[1].priceWithTax).toBeCloseTo(50);
  });

  test('formatOrders normalizes cart data and totals', () => {
    const orders = [
      {
        _id: 'order-1',
        total: 0,
        payment: {},
        shipping: {},
        cart: {
          _id: 'cart-1',
          products: [
            {
              status: 'Processing',
              quantity: 1,
              product: { price: 120, taxable: true },
              priceWithTax: 0,
              totalPrice: 0,
              totalTax: 0
            }
          ]
        }
      }
    ];

    const formatted = store.formatOrders(orders);

    expect(formatted[0].cartId).toBe('cart-1');
    expect(formatted[0].products[0].priceWithTax).toBeGreaterThan(0);
    expect(formatted[0].totalWithTax).toBeGreaterThan(formatted[0].total);
  });

  test('caculateTaxAmount keeps totals zero when all items cancelled', () => {
    const order = {
      total: 999,
      totalTax: 0,
      products: [
        {
          quantity: 1,
          status: 'Cancelled',
          product: { price: 80, taxable: true },
          priceWithTax: 0,
          totalPrice: 0,
          totalTax: 0
        }
      ]
    };

    const result = store.caculateTaxAmount(order);

    expect(result.total).toBe(0);
    expect(result.totalWithTax).toBe(0);
    expect(result.products[0].priceWithTax).toBeCloseTo(80);
  });
});
