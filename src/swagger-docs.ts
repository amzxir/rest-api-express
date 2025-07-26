/**
 * @swagger
 * /api/places/{pid}:
 *   get:
 *     summary: Get Place By Id
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: place_id
 *     responses:
 *       200:
 *         description: ok
 */

/**
 * @swagger
 * /api/places/user/{uid}:
 *   get:
 *     summary: Get Places By User Id
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: user_id
 *     responses:
 *       200:
 *         description: ok
 */

/**
 * @swagger
 * /api/places:
 *   post:
 *     summary: Create Place For User
 *     tags: [Places]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, address]
 *             properties:
 *               title:
 *                 type: string
 *                 example: پارک لاله
 *               description:
 *                 type: string
 *                 example: یک پارک بزرگ در مرکز تهران
 *               address:
 *                 type: string
 *                 example: تهران، خیابان کارگر شمالی
 *     responses:
 *       200:
 *         description: ok
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/places/{pid}:
 *   patch:
 *     summary: Update Place For ID
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: place_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *                 example: خانه کتاب
 *               description:
 *                 type: string
 *                 example: فروشگاه کتاب با بیش از ۵۰۰۰ عنوان
 *     responses:
 *       200:
 *         description: ok
 *       400:
 *         description: Validation error
 *       404:
 *         description: Place Not Found
 */

/**
 * @swagger
 * /api/places/{pid}:
 *   delete:
 *     summary: Delete Place By Id
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: place_id
 *     responses:
 *       200:
 *         description: ok
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get Users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: ok
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Signin User in Application
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: ok
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login User in Application
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: ok
 *       400:
 *         description: Validation error
 */
