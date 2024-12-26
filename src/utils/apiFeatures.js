class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filter data based on a particular condition
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // returning 'this' so that we can chain all the methods
    return this;
  }

  // Sort data
  sort() {
    if (this.queryString.sort) {
      const sortyBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortyBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    // returning 'this' so that we can chain all the methods
    return this;
  }

  // Limit the fields which you want in the response
  fieldLimiting() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-_id -__v');
    }

    // returning 'this' so that we can chain all the methods
    return this;
  }

  // Fetch results as pages
  pagination() {
    const page = this.queryString * 1 || 1;
    const limit = this.queryString * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit); //page=2&limit=10 --> page1: 1-10, page2:11-20

    // returning 'this' so that we can chain all the methods
    return this;
  }
}

module.exports = APIFeatures;
