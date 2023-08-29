//this file holds code for admin users to be able to add new products to the ecomm website

const layout = require('../layout');

//validation method from helper.js
const { getError } = require('../../helpers');

//export the errors object that will display in the terminal if the user encounters an error when tryiing to create a product
module.exports = ({ errors }) => {
    return layout({
        content: `
        <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="subtitle">Create a Product</h1>

          <form method="POST" enctype="multipart/form-data">
            <div class="field">
              <label class="label">Title</label>
              <input class="input" placeholder="Title" name="title">
              <p class="help is-danger">${getError(errors, 'title')}</p>
            </div>
            
            <div class="field">
              <label class="label">Price</label>
              <input class="input" placeholder="Price" name="price">
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>
            
            <div class="field">
              <label class="label">Image</label>            
              <input type="file" name="image" />
            </div>
            <br />
            <button class="button is-primary">Create</button>
          </form>
        </div>
      </div>
    `
  });
};

///Users/elisecarlson/ecomm/views/admin/productsnew/new.js
