```dashboardController.js```

1.
```javascript
    const userObjectId = new Types.ObjectId(String(userId));
```

*   **Explanation:**
Converts into a Mongoose ObjectId to be used in DB queries.

**Purpose:** This ensures that userId is converted to a string, even if it’s not already. This is necessary because MongoDB’s ObjectIds are represented as 24-character hexadecimal strings (they are not just regular strings, but a specific format that MongoDB uses).

ObjectId is a 12-byte binary value, typically represented as a 24-character hexadecimal string. It has more internal structure to guarantee uniqueness and to encode metadata (e.g., creation time).

Methods like '.find' automatically converts that string to 24-character hexadecimal string for querying the database.

`new` is used to create a new ObjectId object from the string you provide. `Types.ObjectId` is the class and we are creating an object of it

Creating a class with . notation:
```javascript
// Create a namespace object
const MyNamespace = {};

// Add a class to the namespace
MyNamespace.MyClass = class {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

// Usage
const instance = new MyNamespace.MyClass('John');
instance.greet();  // Output: Hello, my name is John

```
This means `Types` is the object and `ObjectId` is a object key which is a class in context to `Types.ObjectId`


2. 
```javascript
    const totalIncome = await Income.aggregate([
    // Step 1: Filter documents where userId matches the userObjectId
    { $match: { userId: userObjectId } },

    // Step 2: Group the filtered documents and sum the "amount" field
    { $group: { _id: null, total: { $sum: "amount" } } },
]);

// In MongoDB, an aggregation pipeline is a sequence of stages, and each stage transforms the data in some way (e.g., filtering, grouping, sorting, projecting).

// In MongoDB's aggregation, you always have to use square brackets [] because the aggregation pipeline is always an array of stages.
```



📊 MongoDB Aggregation with Mongoose — Beginner to Pro

This guide walks through the MongoDB Aggregation Pipeline using Mongoose, with step-by-step explanations, real examples, and insights from a developer's learning perspective. If you're wondering "Why do we use square brackets?" or "Is ObjectId a method or a class?" — you're in the right place. 🙌

🚀 What Is Aggregation?
Aggregation in MongoDB is a powerful way to process data and return computed results — like totals, averages, counts, etc.

It's like GROUP BY, WHERE, and SUM() in SQL — but better, and more flexible.

🧠 Core Concept: The Aggregation Pipeline
An aggregation pipeline is a sequence of stages, each transforming the data.

Each stage is an object like { $match: ... }, and the entire pipeline is an array:

```js
[
  { stage1 },
  { stage2 },
  { stage3 },
  ...
]
```

✅ Yes, you always need [] (square brackets) — even for a single stage.
❌ No, you can’t pass multiple objects directly without wrapping them in an array.

📦 Real Example: Summing Income for a User
Let’s say you have an Income collection, and each document looks like:

```js
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  amount: 500
}
```

You want to calculate the total income for a specific user.

🔍 Aggregation Code:
```js
const userObjectId = new Types.ObjectId(userId); // Convert string to ObjectId

const totalIncome = await Income.aggregate([
  { $match: { userId: userObjectId } }, // Filter by user
  { $group: { _id: null, total: { $sum: "amount" } } } // Sum the 'amount' field
]);
```

✅ Output Example:
```js
[
  { _id: null, total: 1200 }
]
```

🔧 Explanation

**Stage 1: $match**
```js
{ $match: { userId: userObjectId } }
```
Filters documents to include only those with the matching userId.

**Stage 2: $group**
```js
{ $group: { _id: null, total: { $sum: "amount" } } }
```
Groups all the matched documents together (because _id: null)
Calculates the sum of the amount field.
Stores the result in a new field called total.

🧱 Understanding Types.ObjectId
```js
const userObjectId = new Types.ObjectId(userId);
```
Types is an object.

ObjectId is a class inside it — not a method.

You create an instance using `new`, just like any other class.

✅ You can structure your own objects the same way, like:
```js
const Utils = {};
Utils.Helper = class { ... };
// Then access it via
Utils.Helper;
```

🛠️ Building Dynamic Pipelines
You can also build the pipeline dynamically:

```js
const pipeline = [];

pipeline.push({ $match: { userId: userObjectId } });

if (filterByDate) {
  pipeline.push({ $match: { date: { $gte: someDate } } });
}

pipeline.push({ $group: { _id: null, total: { $sum: "amount" } } });

const result = await Income.aggregate(pipeline);
```

📌 Key Takeaways
✅ Use [] to pass pipeline stages to `.aggregate()`

🔍 Use `$match` to filter documents

➕ Use `$group` with `$sum` to calculate totals

🧱 `Types.ObjectId` is a class, not a method — use `new`

🎯 Aggregation is powerful and customizable — add stages like `$sort`, `$limit`, `$project`, and more

🧪 Bonus: Try Adding More Stages
Want to sort results?
```js
{ $sort: { amount: -1 } }
```

Want to limit to top 5?
```js
{ $limit: 5 }
```

Want to remove unwanted fields?
```js
{ $project: { _id: 0, total: 1 } }
```

🧠 Still Learning?
That’s the best place to be. 💪 Aggregation can seem tricky at first, but once it clicks, you’ll be using it like a pro.

If you're building anything with MongoDB and Mongoose — aggregation is your friend for all things analytics, reporting, and data summarizing.

✨ Happy Aggregating!


# Data Aggregation Pipeline Full Tutorial
# Data Aggregation and Pipeline in MongoDB using Node.js

This tutorial covers the basics of MongoDB's aggregation framework and how to implement it within a Node.js application.

## 1. Overview of MongoDB Aggregation

MongoDB's Aggregation Framework is a powerful tool for transforming and combining data in a variety of ways. Aggregation allows you to perform operations such as:

- **Filtering** (`$match`)
- **Grouping** (`$group`)
- **Sorting** (`$sort`)
- **Projecting** (Shaping the result) (`$project`)
- **Limiting** (`$limit`)
- **Unwinding Arrays** (`$unwind`)
- **Joining Collections** (`$lookup`)

An aggregation pipeline is a sequence of stages, where each stage processes the data and passes it to the next stage.

## 2. Prerequisites

Before starting, make sure you have:

- MongoDB installed and running on your system, or use MongoDB Atlas.
- Node.js and npm installed.

Install the required packages:

```bash
npm init -y
npm install mongodb
```

## 3. Setting Up a Basic Node.js Project with MongoDB

Create a new directory for your project and navigate to it.

```bash
mkdir mongo-aggregation-tutorial
cd mongo-aggregation-tutorial
```

Install the necessary packages:

```bash
npm install mongodb
```

Create an `index.js` file where you will write the code.

## 4. Basic MongoDB Setup in Node.js

First, we need to connect to MongoDB. The following code will set up the connection:

```javascript
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017'; // Change this to your MongoDB URI (for Atlas or another setup)
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

connectToDatabase();
```

This establishes a basic connection to your MongoDB database.

## 5. Aggregation Pipeline Example

Let's assume we have a collection called `sales` that stores documents with information about transactions.

### Example of a sales document:

```json
{
  "_id": ObjectId("..."),
  "product": "Laptop",
  "quantity": 5,
  "price": 1000,
  "date": "2023-04-01",
  "region": "North"
}
```

We'll perform an aggregation to calculate the total revenue per region.

## 6. Implementing an Aggregation Pipeline

Add this code to your `index.js` to run an aggregation pipeline that groups the sales by region and calculates the total revenue:

```javascript
async function aggregateSales() {
  const db = client.db('store'); // Replace with your database name
  const collection = db.collection('sales'); // Replace with your collection name

  const pipeline = [
    // Step 1: Group by region and calculate total revenue
    {
      $group: {
        _id: "$region", // Group by region
        totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }, // Sum quantity * price
        totalQuantity: { $sum: "$quantity" } // Sum the quantities
      }
    },
    // Step 2: Sort by totalRevenue in descending order
    {
      $sort: { totalRevenue: -1 }
    }
  ];

  try {
    const results = await collection.aggregate(pipeline).toArray();
    console.log('Aggregation Result:', results);
  } catch (err) {
    console.error('Error performing aggregation:', err);
  }
}

aggregateSales();
```

### Explanation of the Aggregation Stages:
- **`$group`**: Groups the documents by the `region` field. For each group, it calculates the `totalRevenue` by multiplying `quantity` and `price`, and sums up the `totalQuantity` sold.
- **`$sort`**: Sorts the results in descending order of `totalRevenue`.

## 7. Additional Aggregation Stages

MongoDB aggregation supports many other stages that you can use depending on your needs. Here are some other common stages:

- **`$match`**: Filters documents based on a condition (like WHERE in SQL).
  
  ```javascript
  {
    $match: { quantity: { $gt: 3 } } // Match sales where quantity is greater than 3
  }
  ```

- **`$project`**: Modifies the shape of the documents (like SELECT in SQL).
  
  ```javascript
  {
    $project: {
      product: 1, // Include product field
      revenue: { $multiply: ["$quantity", "$price"] }, // Add calculated revenue
      _id: 0 // Exclude _id
    }
  }
  ```

- **`$sort`**: Sorts the documents based on fields.
  
  ```javascript
  {
    $sort: { revenue: -1 } // Sort by revenue in descending order
  }
  ```

- **`$limit`**: Limits the number of documents returned.
  
  ```javascript
  {
    $limit: 5 // Only return the top 5 documents
  }
  ```

- **`$unwind`**: Deconstructs an array field and outputs one document for each element of the array.
  
  ```javascript
  {
    $unwind: "$items" // If "items" is an array, this will create a separate document for each item.
  }
  ```

- **`$lookup`**: Performs a join between collections (similar to SQL joins).
  
  ```javascript
  {
    $lookup: {
      from: "products", // Join with the "products" collection
      localField: "product_id", // The field in the sales collection
      foreignField: "_id", // The field in the products collection
      as: "productDetails" // The output field containing joined data
    }
  }
  ```

## 8. Putting It All Together: Full Example

Here is an enhanced example with multiple aggregation stages to calculate the total revenue per region, and then show the top 5 products by revenue.

```javascript
async function aggregateTopProducts() {
  const db = client.db('store');
  const collection = db.collection('sales');

  const pipeline = [
    // Step 1: Match only sales from 2023
    {
      $match: {
        date: { $gte: new Date('2023-01-01'), $lt: new Date('2024-01-01') }
      }
    },
    // Step 2: Group by product and calculate total revenue
    {
      $group: {
        _id: "$product",
        totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
        totalQuantity: { $sum: "$quantity" }
      }
    },
    // Step 3: Sort by total revenue (descending)
    {
      $sort: { totalRevenue: -1 }
    },
    // Step 4: Limit to top 5 products
    {
      $limit: 5
    }
  ];

  try {
    const results = await collection.aggregate(pipeline).toArray();
    console.log('Top 5 Products by Revenue:', results);
  } catch (err) {
    console.error('Error performing aggregation:', err);
  }
}

aggregateTopProducts();
```

## 9. Closing the Connection

Once you're done, remember to close the connection:

```javascript
async function closeConnection() {
  await client.close();
  console.log('Connection closed');
}

process.on('SIGINT', async () => {
  await closeConnection();
  process.exit();
});
```

## 10. Summary

In this tutorial, we covered how to set up a basic Node.js application to connect to MongoDB and perform aggregation operations using MongoDB's aggregation pipeline.

### Key points to remember:

- The aggregation pipeline allows you to transform and combine data in powerful ways.
- You can use operators like `$match`, `$group`, `$sort`, `$project`, `$limit`, and `$lookup` to manipulate your data.
- Node.js is a great tool to interact with MongoDB using the `mongodb` Node.js driver.
- By mastering the aggregation framework, you can handle complex queries and data transformations that would be difficult or impossible with simple queries.


# Other Aggregation Operators or Aggregation Pipeline Stages
# Data Aggregation and Pipeline in MongoDB using Node.js

This tutorial covers the basics of MongoDB's aggregation framework and how to implement it within a Node.js application.

## 1. Overview of MongoDB Aggregation

MongoDB's Aggregation Framework is a powerful tool for transforming and combining data in a variety of ways. Aggregation allows you to perform operations such as:

- **Filtering** (`$match`)
- **Grouping** (`$group`)
- **Sorting** (`$sort`)
- **Projecting** (Shaping the result) (`$project`)
- **Limiting** (`$limit`)
- **Unwinding Arrays** (`$unwind`)
- **Joining Collections** (`$lookup`)

An aggregation pipeline is a sequence of stages, where each stage processes the data and passes it to the next stage.

## 2. Prerequisites

Before starting, make sure you have:

- MongoDB installed and running on your system, or use MongoDB Atlas.
- Node.js and npm installed.

Install the required packages:

```bash
npm init -y
npm install mongodb
```

## 3. Setting Up a Basic Node.js Project with MongoDB

Create a new directory for your project and navigate to it.

```bash
mkdir mongo-aggregation-tutorial
cd mongo-aggregation-tutorial
```

Install the necessary packages:

```bash
npm install mongodb
```

Create an `index.js` file where you will write the code.

## 4. Basic MongoDB Setup in Node.js

First, we need to connect to MongoDB. The following code will set up the connection:

```javascript
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017'; // Change this to your MongoDB URI (for Atlas or another setup)
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

connectToDatabase();
```

This establishes a basic connection to your MongoDB database.

## 5. Aggregation Pipeline Example

Let's assume we have a collection called `sales` that stores documents with information about transactions.

### Example of a sales document:

```json
{
  "_id": ObjectId("..."),
  "product": "Laptop",
  "quantity": 5,
  "price": 1000,
  "date": "2023-04-01",
  "region": "North"
}
```

We'll perform an aggregation to calculate the total revenue per region.

## 6. Implementing an Aggregation Pipeline

Add this code to your `index.js` to run an aggregation pipeline that groups the sales by region and calculates the total revenue:

```javascript
async function aggregateSales() {
  const db = client.db('store'); // Replace with your database name
  const collection = db.collection('sales'); // Replace with your collection name

  const pipeline = [
    // Step 1: Group by region and calculate total revenue
    {
      $group: {
        _id: "$region", // Group by region
        totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }, // Sum quantity * price
        totalQuantity: { $sum: "$quantity" } // Sum the quantities
      }
    },
    // Step 2: Sort by totalRevenue in descending order
    {
      $sort: { totalRevenue: -1 }
    }
  ];

  try {
    const results = await collection.aggregate(pipeline).toArray();
    console.log('Aggregation Result:', results);
  } catch (err) {
    console.error('Error performing aggregation:', err);
  }
}

aggregateSales();
```

### Explanation of the Aggregation Stages:
- **`$group`**: Groups the documents by the `region` field. For each group, it calculates the `totalRevenue` by multiplying `quantity` and `price`, and sums up the `totalQuantity` sold.
- **`$sort`**: Sorts the results in descending order of `totalRevenue`.

## 7. Additional Aggregation Stages

MongoDB aggregation supports many other stages that you can use depending on your needs. Here are some other common stages:

1. **`$match` — Filter Documents**
   The `$match` stage filters the data in a way that is similar to a SQL WHERE clause. It filters out documents that do not meet the specified condition.

   ```javascript
   {
     $match: { quantity: { $gt: 5 } }
   }
   ```

2. **`$group` — Group Documents**
   The `$group` stage is similar to SQL's GROUP BY statement. It allows you to group documents by a specific field and apply aggregate functions like sum, avg, min, max, etc.

   ```javascript
   {
     $group: {
       _id: "$region", // Group by region
       totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }, // Calculate total revenue
       averagePrice: { $avg: "$price" } // Calculate average price
     }
   }
   ```

3. **`$sort` — Sort Documents**
   The `$sort` stage sorts the documents based on a specified field or fields in ascending or descending order.

   ```javascript
   {
     $sort: { totalRevenue: -1 } // Sort by totalRevenue in descending order
   }
   ```

4. **`$project` — Shape Documents**
   The `$project` stage is used to specify which fields to include or exclude, and can also be used to add calculated fields to the output.

   ```javascript
   {
     $project: {
       product: 1, // Include the "product" field
       totalRevenue: { $multiply: ["$quantity", "$price"] }, // Calculate total revenue
       _id: 0 // Exclude the _id field
     }
   }
   ```

5. **`$limit` — Limit the Number of Documents**
   The `$limit` stage restricts the number of documents in the output. It's useful for pagination or when you want to only return a subset of the results.

   ```javascript
   {
     $limit: 5 // Return the top 5 documents
   }
   ```

6. **`$skip` — Skip a Number of Documents**
   The `$skip` stage skips over a specified number of documents. It's commonly used in conjunction with `$limit` for pagination.

   ```javascript
   {
     $skip: 10 // Skip the first 10 documents
   }
   ```

7. **`$unwind` — Deconstruct an Array Field**
   The `$unwind` stage is used when you have an array field and want to deconstruct it so that each element of the array is represented as a separate document.

   ```javascript
   {
     $unwind: "$items" // "items" is an array field, and this will create a new document for each item
   }
   ```

8. **`$lookup` — Join with Another Collection (Left Outer Join)**
   The `$lookup` stage is used to perform a join between two collections. It's similar to SQL joins.

   ```javascript
   {
     $lookup: {
       from: "products", // The collection to join with
       localField: "product_id", // The field in the current collection
       foreignField: "_id", // The field in the "products" collection
       as: "productDetails" // The field that will hold the result of the join
     }
   }
   ```

9. **`$addFields` — Add New Fields**
   The `$addFields` stage is used to add new fields to the documents, or modify existing ones.

   ```javascript
   {
     $addFields: {
       totalRevenue: { $multiply: ["$quantity", "$price"] }
     }
   }
   ```

10. **`$replaceRoot` — Replace the Root Document**
    The `$replaceRoot` stage replaces the entire document with the specified expression, which can be another embedded document or fields.

    ```javascript
    {
      $replaceRoot: { newRoot: "$productDetails" }
    }
    ```

11. **`$out` — Write Results to a Collection**
    The `$out` stage is used to output the results of an aggregation pipeline to a new collection. This is helpful for storing the results for further analysis or reporting.

    ```javascript
    {
      $out: "aggregated_sales"
    }
    ```

12. **`$count` — Count the Number of Documents**
    The `$count` stage counts the number of documents that pass through the pipeline and outputs a document with a count field.

    ```javascript
    {
      $count: "totalSales" // Counts the number of documents and stores the result in the "totalSales" field
    }
    ```

13. **`$facet` — Multiple Pipelines in One Stage**
    The `$facet` stage allows you to run multiple aggregation pipelines within a single stage. It's useful when you need to calculate multiple aggregates at the same time.

    ```javascript
    {
      $facet: {
        "totalRevenueByRegion": [
          { $group: { _id: "$region", totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } } } }
        ],
        "topSellingProducts": [
          { $group: { _id: "$product", totalQuantity: { $sum: "$quantity" } } },
          { $sort: { totalQuantity: -1 } },
          { $limit: 5 }
        ]
      }
    }
    ```

14. **`$arrayToObject` — Convert Arrays to Objects**
    The `$arrayToObject` operator is used to convert an array of key-value pairs into an object.

    ```javascript
    {
      $project: {
        convertedObject: { $arrayToObject: [["key1", "value1"], ["key2", "value2"]] }
      }
    }
    ```

15. **`$cond` — Conditional Logic (Like IF-ELSE)**
    The `$cond` operator provides conditional logic. It is similar to the IF-ELSE statement in programming.

    ```javascript
    {
      $project: {
        status: {
          $cond: { if: { $gte: ["$quantity", 10] }, then: "High", else: "Low" }
        }
      }
    }
    ```

16. **`$regexMatch` — Match String Patterns**
    The `$regexMatch` operator is used for regular expression matching within the aggregation pipeline.

    ```javascript
    {
      $match: {
        product: { $regex: "^Lap", $options: "i" } // Match products starting with "Lap" (case-insensitive)
      }
    }
    ```

17. **Aggregate Functions: `$min`, `$max`, `$avg`, `$sum`**
    These operators are used in `$group` to perform basic mathematical operations on fields.

    ```javascript
    {
      $group: {
        _id: "$region",
        minPrice: { $min: "$price" }, // Minimum price in each region
        maxPrice: { $max: "$price" }, // Maximum price in each region
        avgPrice: { $avg: "$price" }  // Average price in each region
      }
    }
    ```

18. **Date Operators: `$isoDayOfWeek` and `$isoWeek`**
    These operators allow you to extract ISO week information from dates.

    ```javascript
    {
      $project: {
        isoDayOfWeek: { $isoDayOfWeek: "$date" }, // Get the ISO day of the week
        isoWeek: { $isoWeek: "$date" } // Get the ISO week number
      }
    }
    ```

19. **`$graphLookup` — Recursive Lookup**
    The `$graphLookup` operator is used for recursive queries, where a document references other documents within the same collection.

    ```javascript
    {
      $graphLookup: {
        from: "employees",
        startWith: "$managerId",
        connectFromField: "managerId",
        connectToField: "_id",
        as: "employeeHierarchy"
      }
    }
    ```

20. **`$setWindowFields` — Window Functions (MongoDB 5.0+)**
    This operator allows you to calculate window-based aggregates, similar to SQL's window functions like ROW_NUMBER(), RANK(), etc.

    ```javascript
    {
      $setWindowFields: {
        sortBy: { date: 1 },
        output: {
          rank: { $rank: {} }
        }
      }
    }
    ```

## 8. Putting It All Together: Full Example

Here is an enhanced example with multiple aggregation stages to calculate the total revenue per region, and then show the top 5 products by revenue.

```javascript
async function aggregateTopProducts() {
  const db = client.db('store');
  const collection = db.collection('sales');

  const pipeline = [
    // Step 1: Match only sales from 2023
    {
      $match: {
        date: { $gte: new Date('2023-01-01'), $lt: new Date('2024-01-01') }
      }
    },
    // Step 2: Group by product and calculate total revenue
    {
      $group: {
        _id: "$product",
        totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
        totalQuantity: { $sum: "$quantity" }
      }
    },
    // Step 3: Sort by total revenue (descending)
    {
      $sort: { totalRevenue: -1 }
    },
    // Step 4: Limit to top 5 products
    {
      $limit: 5
    }
  ];

  try {
    const results = await collection.aggregate(pipeline).toArray();
    console.log('Top 5 Products by Revenue:', results);
  } catch (err) {
    console.error('Error performing aggregation:', err);
  }
}

aggregateTopProducts();
```

## 9. Closing the Connection

Once you're done, remember to close the connection:

```javascript
async function closeConnection() {
  await client.close();
  console.log('Connection closed');
}

process.on('SIGINT', async () => {
  await closeConnection();
  process.exit();
});
```

## 10. Summary

In this tutorial, we covered how to set up a basic Node.js application to connect to MongoDB and perform aggregation operations using MongoDB's aggregation pipeline.

### Key points to remember:

- The aggregation pipeline allows you to transform and combine data in powerful ways.
- You can use operators like `$match`, `$group`, `$sort`, `$project`, `$limit`, and `$lookup` to manipulate your data.
- Node.js is a great tool to interact with MongoDB using the `mongodb` Node.js driver.
- By mastering the aggregation framework, you can handle complex queries and data transformations that would be difficult or impossible with simple queries.

Feel free to experiment with these operators in your Node.js application!

