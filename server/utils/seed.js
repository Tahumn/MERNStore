const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const setupDB = require('./db');
const seedData = require('./seedData');
const { ROLES, MERCHANT_STATUS, EMAIL_PROVIDER } = require('../constants');
const User = require('../models/user');
const Brand = require('../models/brand');
const Product = require('../models/product');
const Category = require('../models/category');
const Merchant = require('../models/merchant');
const Review = require('../models/review');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Wishlist = require('../models/wishlist');
const Address = require('../models/address');
const Contact = require('../models/contact');
const { selectProductImage } = require('./productImage');

const args = process.argv.slice(2);
const adminEmail = args[0];
const adminPassword = args[1];
const shouldReset =
  args.includes('--reset') || process.env.SEED_RESET === 'true';

const logStep = (message, symbol = chalk.blue('•')) => {
  console.log(`${symbol} ${chalk.blue(message)}`);
};

const hashPassword = async plain => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

const cleanDatabase = async () => {
  logStep('Resetting collections');

  await Promise.all([
    Product.deleteMany({}),
    Brand.deleteMany({}),
    Category.deleteMany({}),
    Merchant.deleteMany({}),
    Review.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Wishlist.deleteMany({}),
    Address.deleteMany({}),
    Contact.deleteMany({})
  ]);

  await User.deleteMany({ role: { $ne: ROLES.Admin } });
};

const seedAdminUser = async () => {
  if (!adminEmail || !adminPassword) {
    throw new Error('Missing admin email or password arguments.');
  }

  logStep('Seeding admin user');

  const passwordHash = await hashPassword(adminPassword);
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    existingAdmin.firstName = existingAdmin.firstName || 'Admin';
    existingAdmin.lastName = existingAdmin.lastName || 'User';
    existingAdmin.password = passwordHash;
    existingAdmin.role = ROLES.Admin;
    existingAdmin.merchant = null;
    existingAdmin.provider = EMAIL_PROVIDER.Email;
    await existingAdmin.save();
    console.log(
      `${chalk.green('✓')} ${chalk.green(
        `Admin user updated (${existingAdmin.email})`
      )}`
    );
    return existingAdmin;
  }

  const admin = new User({
    email: adminEmail,
    password: passwordHash,
    firstName: 'Admin',
    lastName: 'User',
    role: ROLES.Admin,
    provider: EMAIL_PROVIDER.Email
  });

  await admin.save();
  console.log(
    `${chalk.green('✓')} ${chalk.green(
      `Admin user created (${admin.email})`
    )}`
  );
  return admin;
};

const seedCategories = async categories => {
  logStep('Creating categories');
  const categoryMap = new Map();

  for (const categoryData of categories) {
    const { name, description } = categoryData;
    let categoryDoc = await Category.findOne({ name });

    if (!categoryDoc) {
      categoryDoc = new Category({
        name,
        description,
        isActive: true
      });
    } else {
      categoryDoc.description = description;
      categoryDoc.isActive = true;
    }

    await categoryDoc.save();
    categoryMap.set(name, categoryDoc);
  }

  console.log(
    `${chalk.green('✓')} ${chalk.green(
      `${categoryMap.size} categories ready`
    )}`
  );
  return categoryMap;
};

const seedMerchants = async merchants => {
  logStep('Creating merchants');
  const merchantMap = new Map();

  for (const merchantData of merchants) {
    const { email, name, phoneNumber, brandName, business } = merchantData;

    let merchantDoc = await Merchant.findOne({ email });
    if (!merchantDoc) {
      merchantDoc = new Merchant({
        email,
        name,
        phoneNumber,
        brandName,
        business
      });
    }

    merchantDoc.name = name;
    merchantDoc.phoneNumber = phoneNumber;
    merchantDoc.brandName = brandName;
    merchantDoc.business = business;
    merchantDoc.isActive = true;
    merchantDoc.status = MERCHANT_STATUS.Approved;

    await merchantDoc.save();
    merchantMap.set(email, merchantDoc);
  }

  console.log(
    `${chalk.green('✓')} ${chalk.green(
      `${merchantMap.size} merchants ready`
    )}`
  );
  return merchantMap;
};

const seedBrands = async (brands, merchantMap) => {
  logStep('Creating brands');
  const brandMap = new Map();

  for (const brandData of brands) {
    const { name, description, merchantEmail } = brandData;
    const merchantDoc = merchantMap.get(merchantEmail);

    let brandDoc = await Brand.findOne({ name });
    if (!brandDoc) {
      brandDoc = new Brand({
        name,
        description,
        isActive: true,
        merchant: merchantDoc ? merchantDoc._id : null
      });
    } else {
      brandDoc.description = description;
      brandDoc.isActive = true;
      brandDoc.merchant = merchantDoc ? merchantDoc._id : null;
    }

    await brandDoc.save();
    brandMap.set(name, brandDoc);

    if (merchantDoc) {
      merchantDoc.brand = brandDoc._id;
      merchantDoc.brandName = name;
      merchantDoc.isActive = true;
      merchantDoc.status = MERCHANT_STATUS.Approved;
      await merchantDoc.save();
    }
  }

  console.log(
    `${chalk.green('✓')} ${chalk.green(`${brandMap.size} brands ready`)}`
  );
  return brandMap;
};

const buildImageSource = productData => {
  return {
    name: productData.name,
    sku: productData.sku,
    brand: { name: productData.brandName },
    category: { name: productData.categoryName }
  };
};

const seedProducts = async (products, brandMap, categoryMap) => {
  logStep('Creating products');
  const productMap = new Map();

  for (const productData of products) {
    const {
      sku,
      name,
      description,
      price,
      quantity,
      taxable,
      isFeatured,
      brandName,
      categoryName,
      imageUrl
    } = productData;

    const brandDoc = brandMap.get(brandName);
    const categoryDoc = categoryMap.get(categoryName);

    if (!brandDoc || !categoryDoc) {
      console.warn(
        `${chalk.yellow(
          '!'
        )} Missing brand or category for product ${name} (brand: ${brandName}, category: ${categoryName})`
      );
      continue;
    }

    let productDoc = await Product.findOne({ sku });

    if (!productDoc) {
      productDoc = new Product({
        sku,
        name,
        description,
        quantity,
        price,
        taxable,
        isActive: true,
        isFeatured,
        brand: brandDoc._id
      });
    } else {
      productDoc.name = name;
      productDoc.description = description;
      productDoc.quantity = quantity;
      productDoc.price = price;
      productDoc.taxable = taxable;
      productDoc.isActive = true;
      productDoc.isFeatured = isFeatured;
      productDoc.brand = brandDoc._id;
    }

    const resolvedImage =
      imageUrl && `${imageUrl}`.trim().length > 0
        ? imageUrl
        : selectProductImage(buildImageSource(productData));
    productDoc.imageUrl = resolvedImage;

    await productDoc.save();

    await Category.updateOne(
      { _id: categoryDoc._id },
      {
        $addToSet: { products: productDoc._id },
        $set: { isActive: true }
      }
    );

    productMap.set(sku, productDoc);
  }

  console.log(
    `${chalk.green('✓')} ${chalk.green(
      `${productMap.size} products ready`
    )}`
  );
  return productMap;
};

const seedMembers = async members => {
  logStep('Creating member accounts');

  for (const member of members) {
    const { email, firstName, lastName, password } = member;
    const passwordHash = await hashPassword(password);

    let userDoc = await User.findOne({ email });

    if (!userDoc) {
      userDoc = new User({
        email,
        firstName,
        lastName,
        password: passwordHash,
        role: ROLES.Member,
        provider: EMAIL_PROVIDER.Email
      });
    } else {
      userDoc.firstName = firstName;
      userDoc.lastName = lastName;
      userDoc.password = passwordHash;
      userDoc.role = ROLES.Member;
      userDoc.provider = EMAIL_PROVIDER.Email;
      userDoc.merchant = null;
    }

    await userDoc.save();
  }

  console.log(
    `${chalk.green('✓')} ${chalk.green(
      `${members.length} member accounts ready`
    )}`
  );
};

const seedMerchantUsers = async (merchantUsers, merchantMap) => {
  logStep('Creating merchant accounts');

  for (const merchantUser of merchantUsers) {
    const { email, firstName, lastName, password } = merchantUser;
    const merchantDoc = merchantMap.get(email);

    if (!merchantDoc) {
      console.warn(
        `${chalk.yellow(
          '!'
        )} Skipping merchant user ${email} because merchant record was not found.`
      );
      continue;
    }

    const passwordHash = await hashPassword(password);
    let userDoc = await User.findOne({ email });

    if (!userDoc) {
      userDoc = new User({
        email,
        firstName,
        lastName,
        password: passwordHash,
        role: ROLES.Merchant,
        merchant: merchantDoc._id,
        provider: EMAIL_PROVIDER.Email
      });
    } else {
      userDoc.firstName = firstName;
      userDoc.lastName = lastName;
      userDoc.password = passwordHash;
      userDoc.role = ROLES.Merchant;
      userDoc.merchant = merchantDoc._id;
      userDoc.provider = EMAIL_PROVIDER.Email;
    }

    await userDoc.save();
  }

  console.log(
    `${chalk.green('✓')} ${chalk.green(
      `${merchantUsers.length} merchant accounts ready`
    )}`
  );
};

const seedReviews = async (productReviews, productMap) => {
  logStep('Creating product reviews');

  const reviewEntries = Object.entries(productReviews);
  let inserted = 0;

  for (const [sku, reviews] of reviewEntries) {
    const productDoc = productMap.get(sku);
    if (!productDoc) {
      console.warn(
        `${chalk.yellow(
          '!'
        )} Cannot create reviews for product ${sku} because it was not seeded.`
      );
      continue;
    }

    for (const reviewData of reviews) {
      const { userEmail, rating, review, isRecommended } = reviewData;
      const userDoc = await User.findOne({ email: userEmail });

      if (!userDoc) {
        console.warn(
          `${chalk.yellow(
            '!'
          )} Skipping review for ${sku} because user ${userEmail} was not found.`
        );
        continue;
      }

      const existingReview = await Review.findOne({
        product: productDoc._id,
        user: userDoc._id
      });

      if (existingReview) {
        existingReview.rating = rating;
        existingReview.review = review;
        existingReview.isRecommended = isRecommended;
        await existingReview.save();
      } else {
        const reviewDoc = new Review({
          product: productDoc._id,
          user: userDoc._id,
          rating,
          review,
          isRecommended
        });

        await reviewDoc.save();
        inserted += 1;
      }
    }
  }

  console.log(
    `${chalk.green('✓')} ${chalk.green(`${inserted} reviews created`)}`
  );
};

const seedDB = async () => {
  try {
    console.log(
      `${chalk.blue('✓')} ${chalk.blue('Seed database process started')}`
    );

    if (shouldReset) {
      await cleanDatabase();
    } else {
      logStep(
        'Skipping full database reset (use --reset to perform a clean seed)'
      );
    }
    await seedAdminUser();

    const categories = await seedCategories(seedData.categories);
    const merchants = await seedMerchants(seedData.merchants);
    const brands = await seedBrands(seedData.brands, merchants);
    const products = await seedProducts(seedData.products, brands, categories);

    await seedMembers(seedData.members);
    await seedMerchantUsers(seedData.merchantUsers, merchants);
    await seedReviews(seedData.productReviews, products);

    console.log(
      `${chalk.green('✓')} ${chalk.green('Database seeding completed')}`
    );
  } catch (error) {
    console.error(
      `${chalk.red('x')} ${chalk.red('Error while seeding database')}`
    );
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log(
      `${chalk.blue('✓')} ${chalk.blue('Database connection closed!')}`
    );
  }
};

(async () => {
  try {
    await setupDB();
    await seedDB();
  } catch (error) {
    console.error(`Error initializing database: ${error.message}`);
  }
})();
