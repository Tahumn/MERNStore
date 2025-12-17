import http from 'k6/http';
import { sleep, group, check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const ENV = typeof __ENV !== 'undefined' ? __ENV : {};

const BASE_URL = (ENV.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const API_PREFIX = ENV.API_PREFIX || '/api';
const API_BASE = `${BASE_URL}${API_PREFIX.startsWith('/') ? API_PREFIX : `/${API_PREFIX}`}`;

const TEST_EMAIL = ENV.TEST_EMAIL || 'jane.doe@example.com';
const TEST_PASSWORD = ENV.TEST_PASSWORD || 'customer123';
const ADMIN_EMAIL = ENV.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = ENV.ADMIN_PASSWORD || 'AdminPass123';
const MERCHANT_EMAIL = ENV.MERCHANT_EMAIL || 'contact@techwave.com';
const MERCHANT_PASSWORD = ENV.MERCHANT_PASSWORD || 'merchant123';
const CART_QTY = Number(ENV.CART_QTY || 1);
const PAYMENT_METHOD = ENV.PAYMENT_METHOD || 'COD';
const PRODUCT_PAGE_MAX = Number(ENV.PRODUCT_PAGE_MAX || 3);
const REQUEST_TIMEOUT = Number(ENV.REQUEST_TIMEOUT || 30000);

const baseHeaders = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent': 'k6-mernstore-load-test'
};
const jsonParams = {
  headers: { ...baseHeaders, 'Content-Type': 'application/json' },
  timeout: REQUEST_TIMEOUT
};

const productListTrend = new Trend('product_list_duration');
const featuredTrend = new Trend('featured_duration');
const checkoutSuccess = new Rate('checkout_success');
const adminSuccess = new Rate('admin_success');
const merchantSuccess = new Rate('merchant_success');

const BROWSE_START_RATE = Number(ENV.BROWSE_START_RATE || 1);
const BROWSE_PEAK_RATE = Number(ENV.BROWSE_PEAK_RATE || 8);
const BROWSE_VUS = Number(ENV.BROWSE_VUS || 12);
const BROWSE_MAX_VUS = Number(ENV.BROWSE_MAX_VUS || 30);
const CHECKOUT_PEAK_VUS = Number(ENV.CHECKOUT_PEAK_VUS || 4);
const ADMIN_VUS = Number(ENV.ADMIN_VUS || 3);
const MERCHANT_VUS = Number(ENV.MERCHANT_VUS || 3);

export const options = {
  scenarios: {
    browse: {
      executor: 'ramping-arrival-rate',
      exec: 'browseFlow',
      startRate: BROWSE_START_RATE,
      timeUnit: '1s',
      preAllocatedVUs: BROWSE_VUS,
      maxVUs: BROWSE_MAX_VUS,
      stages: [
        { duration: ENV.BROWSE_RAMP_UP || '30s', target: BROWSE_PEAK_RATE },
        { duration: ENV.BROWSE_PEAK_HOLD || '1m30s', target: BROWSE_PEAK_RATE },
        { duration: ENV.BROWSE_RAMP_DOWN || '30s', target: 0 }
      ]
    },
    checkout: {
      executor: 'ramping-vus',
      exec: 'buyerFlow',
      startTime: ENV.CHECKOUT_OFFSET || '10s',
      startVUs: 0,
      stages: [
        { duration: ENV.CHECKOUT_RAMP_UP || '30s', target: CHECKOUT_PEAK_VUS },
        { duration: ENV.CHECKOUT_PEAK_HOLD || '1m', target: CHECKOUT_PEAK_VUS },
        { duration: ENV.CHECKOUT_RAMP_DOWN || '30s', target: 0 }
      ]
    },
    admin: {
      executor: 'ramping-vus',
      exec: 'adminFlow',
      startTime: ENV.ADMIN_OFFSET || '15s',
      startVUs: 0,
      stages: [
        { duration: ENV.ADMIN_RAMP_UP || '15s', target: ADMIN_VUS },
        { duration: ENV.ADMIN_PEAK_HOLD || '45s', target: ADMIN_VUS },
        { duration: ENV.ADMIN_RAMP_DOWN || '15s', target: 0 }
      ]
    },
    merchant: {
      executor: 'ramping-vus',
      exec: 'merchantFlow',
      startTime: ENV.MERCHANT_OFFSET || '25s',
      startVUs: 0,
      stages: [
        { duration: ENV.MERCHANT_RAMP_UP || '15s', target: MERCHANT_VUS },
        { duration: ENV.MERCHANT_PEAK_HOLD || '45s', target: MERCHANT_VUS },
        { duration: ENV.MERCHANT_RAMP_DOWN || '15s', target: 0 }
      ]
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<2500'],
    checkout_success: ['rate>0.85'],
    admin_success: ['rate>0.85'],
    merchant_success: ['rate>0.85']
  },
  summaryTrendStats: ['avg', 'min', 'max', 'p(90)', 'p(95)']
};

export function browseFlow() {
  group('public-browse', () => {
    const health = http.get(`${BASE_URL}/health`, {
      headers: baseHeaders,
      timeout: REQUEST_TIMEOUT
    });
    check(health, { 'health ok': r => r.status === 200 });

    const featured = http.get(`${API_BASE}/product/featured?limit=8`, {
      headers: baseHeaders,
      timeout: REQUEST_TIMEOUT
    });
    featuredTrend.add(featured.timings.duration);
    check(featured, { 'featured ok': r => r.status === 200 });

    const page = randomIntBetween(1, PRODUCT_PAGE_MAX);
    const list = http.get(`${API_BASE}/product/list?page=${page}&limit=12`, {
      headers: baseHeaders,
      timeout: REQUEST_TIMEOUT
    });
    productListTrend.add(list.timings.duration);
    check(list, { 'list ok': r => r.status === 200 });

    const products = safeJson(list)?.products || [];
    const product = pickRandom(products);

    if (product?.slug) {
      const slugRes = http.get(`${API_BASE}/product/item/${product.slug}`, {
        headers: baseHeaders,
        timeout: REQUEST_TIMEOUT
      });
      check(slugRes, { 'detail ok': r => r.status === 200 });
    }

    http.get(`${API_BASE}/product/popular?limit=6`, {
      headers: baseHeaders,
      timeout: REQUEST_TIMEOUT
    });
    http.get(`${API_BASE}/category/list`, {
      headers: baseHeaders,
      timeout: REQUEST_TIMEOUT
    });

    const searchTerm = product?.name?.split(' ')?.[0];
    if (searchTerm) {
      const search = http.get(
        `${API_BASE}/product/list/search/${encodeURIComponent(searchTerm)}`,
        {
          headers: baseHeaders,
          timeout: REQUEST_TIMEOUT
        }
      );
      check(search, {
        'search handled': r => r.status === 200 || r.status === 404
      });
    }
  });

  sleep(randomIntBetween(1, 3));
}

export function buyerFlow() {
  group('member-checkout', () => {
    const login = http.post(
      `${API_BASE}/auth/login`,
      JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
      jsonParams
    );
    const loginBody = safeJson(login);
    const token = loginBody?.token;
    const loginOk = check(login, {
      'login ok': r => r.status === 200 && !!token
    });
    if (!loginOk) {
      checkoutSuccess.add(0);
      return;
    }

    const authGetParams = authParams(token, false);
    const authJsonParams = authParams(token, true);

    const addressRes = http.get(`${API_BASE}/address`, authGetParams);
    const addresses = safeJson(addressRes)?.addresses || [];

    const list = http.get(
      `${API_BASE}/product/list?limit=12&page=${randomIntBetween(1, PRODUCT_PAGE_MAX)}`,
      { headers: baseHeaders, timeout: REQUEST_TIMEOUT }
    );
    const product = pickRandom(safeJson(list)?.products || []);
    if (!product || !(product._id || product.id)) {
      checkoutSuccess.add(0);
      return;
    }

    const cartPayload = {
      products: [
        {
          product: product._id || product.id,
          quantity: CART_QTY,
          price: Number(product.price) || 0,
          taxable: Boolean(product.taxable)
        }
      ]
    };

    const cartRes = http.post(
      `${API_BASE}/cart/add`,
      JSON.stringify(cartPayload),
      authJsonParams
    );
    const cartId = safeJson(cartRes)?.cartId;
    const cartOk = check(cartRes, {
      'cart ok': r => r.status === 200 && !!cartId
    });
    if (!cartOk) {
      checkoutSuccess.add(0);
      return;
    }

    const shipping = buildShipping(addresses);
    const total = Number(
      cartPayload.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ).toFixed(2)
    );

    const orderPayload = {
      cartId,
      total,
      paymentMethod: PAYMENT_METHOD,
      useNewAddress: shipping.useNewAddress,
      shippingAddress: shipping.shippingAddress
    };

    if (!shipping.useNewAddress && shipping.selectedAddressId) {
      orderPayload.selectedAddressId = shipping.selectedAddressId;
    }

    const orderRes = http.post(
      `${API_BASE}/order/add`,
      JSON.stringify(orderPayload),
      authJsonParams
    );
    const orderBody = safeJson(orderRes);
    const orderOk = check(orderRes, {
      'order ok': r => r.status === 200 && orderBody?.success === true
    });

    checkoutSuccess.add(orderOk ? 1 : 0);

    if (orderOk) {
      http.get(`${API_BASE}/order/me`, authGetParams);
    }
  });

  sleep(randomIntBetween(1, 4));
}

export function adminFlow() {
  group('admin-ops', () => {
    const login = http.post(
      `${API_BASE}/auth/login`,
      JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
      jsonParams
    );
    const token = safeJson(login)?.token;
    const loginOk = check(login, {
      'admin login ok': r => r.status === 200 && !!token
    });
    if (!loginOk) {
      adminSuccess.add(0);
      return;
    }

    const authGetParams = authParams(token, false);

    const productsRes = http.get(`${API_BASE}/product`, authGetParams);
    const ordersRes = http.get(`${API_BASE}/order?page=1&limit=5`, authGetParams);
    const summaryRes = http.get(`${API_BASE}/dashboard/summary`, authGetParams);

    const success =
      check(productsRes, { 'admin products ok': r => r.status === 200 }) &&
      check(ordersRes, { 'admin orders ok': r => r.status === 200 }) &&
      check(summaryRes, { 'admin summary ok': r => r.status === 200 });

    adminSuccess.add(success ? 1 : 0);
  });

  sleep(randomIntBetween(1, 3));
}

export function merchantFlow() {
  group('merchant-ops', () => {
    const login = http.post(
      `${API_BASE}/auth/login`,
      JSON.stringify({ email: MERCHANT_EMAIL, password: MERCHANT_PASSWORD }),
      jsonParams
    );
    const token = safeJson(login)?.token;
    const loginOk = check(login, {
      'merchant login ok': r => r.status === 200 && !!token
    });
    if (!loginOk) {
      merchantSuccess.add(0);
      return;
    }

    const authGetParams = authParams(token, false);

    const productsRes = http.get(`${API_BASE}/product`, authGetParams);
    const selectRes = http.get(`${API_BASE}/product/list/select`, authGetParams);
    const ordersRes = http.get(`${API_BASE}/order?page=1&limit=5`, authGetParams);

    const success =
      check(productsRes, { 'merchant products ok': r => r.status === 200 }) &&
      check(selectRes, { 'merchant select ok': r => r.status === 200 }) &&
      check(ordersRes, { 'merchant orders ok': r => r.status === 200 });

    merchantSuccess.add(success ? 1 : 0);
  });

  sleep(randomIntBetween(1, 3));
}

function safeJson(res) {
  try {
    return res.json();
  } catch (error) {
    return null;
  }
}

function pickRandom(items) {
  if (!items || items.length === 0) return null;
  const index = randomIntBetween(0, items.length - 1);
  return items[index];
}

function randomIntBetween(min, max) {
  if (typeof min !== 'number' || typeof max !== 'number') {
    return min;
  }

  if (max <= min) {
    return min;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function authParams(token, asJson) {
  const headers = { ...baseHeaders, Authorization: token };
  if (asJson) {
    headers['Content-Type'] = 'application/json';
  }
  return { headers, timeout: REQUEST_TIMEOUT };
}

function buildShipping(addresses) {
  if (addresses && addresses.length > 0) {
    const address = pickRandom(addresses);
    return {
      useNewAddress: false,
      selectedAddressId: address?._id,
      shippingAddress: {
        fullName: address?.fullName || 'Seeded User',
        phoneNumber: address?.phoneNumber || '+1000000000',
        address: address?.address || 'Seed address',
        city: address?.city || 'Hanoi',
        state: address?.state || 'HN',
        country: address?.country || 'VN',
        zipCode: address?.zipCode || '100000',
        note: 'Load test order (saved address)'
      }
    };
  }

  return {
    useNewAddress: true,
    selectedAddressId: null,
    shippingAddress: {
      fullName: ENV.TEST_FULL_NAME || 'K6 Shopper',
      phoneNumber: ENV.TEST_PHONE || '+84999999999',
      address: ENV.TEST_ADDRESS || '123 K6 Street',
      city: ENV.TEST_CITY || 'Hanoi',
      state: ENV.TEST_STATE || 'HN',
      country: ENV.TEST_COUNTRY || 'VN',
      zipCode: ENV.TEST_ZIP || '100000',
      note: 'Load test order (new address)'
    }
  };
}
