jest.mock('../../models/product', () => ({
  bulkWrite: jest.fn()
}));

const store = require('../../utils/store');

const buildOrder = products => ({
  total: 0,
  totalTax: 0,
  products
});

describe('store utils edge cases', () => {
  test('handles zero and negative price/quantity gracefully', () => {
    const items = [
      { product: 'A', price: 0, quantity: 2, taxable: true },
      { product: 'B', price: 100, quantity: 0, taxable: true },
      { product: 'C', price: -5, quantity: 3, taxable: false },
      { product: 'D', price: 25, quantity: -2, taxable: true },
      { product: 'E', price: 10, quantity: 1 }
    ];

    const result = store.caculateItemsSalesTax(items);

    result.forEach(item => {
      expect(Number.isFinite(item.totalPrice)).toBe(true);
      expect(Number.isFinite(item.priceWithTax)).toBe(true);
      expect(Number.isFinite(item.totalTax)).toBe(true);
    });
  });

  test('caculateTaxAmount tolerates product missing fields', () => {
    const order = buildOrder([
      { status: 'Processing', product: null, quantity: 1, totalPrice: 0, totalTax: 0 },
      { status: 'Processing', product: {}, quantity: 2, totalPrice: 0, totalTax: 0 }
    ]);

    const updated = store.caculateTaxAmount(order);

    expect(updated.total).toBe(0);
    expect(updated.totalWithTax).toBe(0);
  });

  test('formatOrders works even if cart or products missing', () => {
    const orders = [
      { _id: 'o1', total: 10, cart: null, payment: {}, shipping: {} },
      {
        _id: 'o2',
        total: 0,
        cart: { _id: 'c2', products: [] },
        payment: {},
        shipping: {}
      }
    ];

    const formatted = store.formatOrders(orders);

    expect(formatted[0]._id).toBe('o1');
    expect(formatted[0].products).toBeUndefined();
    expect(formatted[1].cartId).toBe('c2');
  });

  test('caculateTaxAmount does not throw when taxable flag is undefined', () => {
    const order = buildOrder([
      {
        status: 'Processing',
        quantity: 1,
        product: { price: 42 },
        totalPrice: 0,
        totalTax: 0
      }
    ]);

    expect(() => store.caculateTaxAmount(order)).not.toThrow();
  });

  test('fuzz random inputs to avoid NaN results', () => {
    for (let i = 0; i < 100; i += 1) {
      const price = (Math.random() - 0.5) * 500;
      const quantity = Math.floor(Math.random() * 6) - 2;
      const item = {
        product: `P-${i}`,
        price,
        quantity,
        taxable: Math.random() > 0.5
      };

      const [{ totalPrice, priceWithTax, totalTax }] = store.caculateItemsSalesTax([
        item
      ]);

      expect(Number.isFinite(totalPrice)).toBe(true);
      expect(Number.isFinite(priceWithTax)).toBe(true);
      expect(Number.isFinite(totalTax)).toBe(true);
    }
  });
});
