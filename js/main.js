Vue.config.devtools = true;

Vue.component("product-details", {
	props: {
		details: {
			type: Array,
			required: true
		}
	},
	template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
});
Vue.component("product", {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `
		<div class="product">
			<div class="product-image">
				<img :src="image">
			</div>
			<div class="product-info">
				
				<h1>{{title}}</h1>
				<p v-if="inStock> 10" >In Stock</p>
				<p v-else-if="inStock <=10 && inStock> 0">
					Almost Sold out
				</p>
				<p v-else>Sold Out</p>
				<p>{{sale}}</p>
				<p>Shipping? {{shipping}}</p>
				
				<product-details :details="details"></product-details>

				<div v-for="(variant, index) in variants"
					:key="variant.id"
					class="color-box"
					:style="{backgroundColor:variant.name}"
					@mouseover="updateProduct(index)">

				</div>

				<button v-on:click="addToCart"
					:disabled="!inStock"
					:class="{ disabledButton: !inStock}">Add to Cart</button>
				
				<button v-on:click="removeFromCart">Remove From Cart</button>

				
			</div>

			<div>
				<h2>Reviews</h2>
				<p v-if="!reviews.length">There are no reviews yet.</p>
				<ul>
					<li v-for="review in reviews"><p>{{review.name}}</p>
					<p>Review : {{review.review}}</p></li>
				</ul>
			</div>

			<product-review @review-Submitted="addReview"></product-review>
		</div>
	`,
	data() {
		return {
			brand: "Vue Mastery",
			product: "Socks",
			selectedVariant: 0,
			count: 0,
			onSale: false,
			details: ["80% cotton", "20% polyester", "Gender-neutral"],
			variants: [
				{
					id: 1,
					image: "./assets/vmSocks-green-onWhite.jpg",
					name: "Green",
					quantity: 20
				},
				{
					id: 2,
					image: "./assets/vmSocks-blue-onWhite.jpg",
					name: "Blue",
					quantity: 5
				},
				{
					id: 3,
					image: "./assets/vmSocks-blue-onWhite.jpg",
					name: "Blue",
					quantity: 26
				},
				{
					id: 4,
					image: "./assets/vmSocks-blue-onWhite.jpg",
					name: "Blue",
					quantity: 56
				}
			],
			reviews: []
		};
	},
	methods: {
		addToCart: function() {
			//this.cart += 1;
			this.$emit("add-to-cart", this.variants[this.selectedVariant].id);
		},
		removeFromCart: function() {
			this.$emit(
				"remove-from-cart",
				this.variants[this.selectedVariant].id
			);
		},
		updateProduct: function(index) {
			this.selectedVariant = index;
		},
		addReview: function(productReview) {
			this.reviews.push(productReview);
		}
	},
	computed: {
		title() {
			return this.brand + " " + this.product;
		},

		image() {
			return this.variants[this.selectedVariant].image;
		},

		inStock() {
			return this.variants[this.selectedVariant].quantity;
		},

		sale() {
			if (this.onSale)
				return this.brand + " " + this.product + " are on sale!";
			else return this.brand + " " + this.product;
		},

		shipping() {
			if (this.premium) return "free";
			return 2.99;
		}
	}
});

Vue.component("product-review", {
	template: `
		<div>
			<h3>Form</h3>
			<form class="review-form" @submit.prevent="onSubmit">

			<p v-if="errors.length">
			<b>Please correct the following error(s)</b>
				<ul>
					<li v-for="error in errors">{{error}}</li>
				</ul>
			</p>
			<p>
				<label for="name">Name:</label>
				<input v-model="name">
			</p>
			<p>
				<label for="review">Review:</label>
				<textarea id="review" v-model="review"></textarea>
			</p>
			<p>
				<lable for="rating">Rating:</lable>
				<select id="rating" v-model.number="rating">
					<option>5</option>
					<option>4</option>
					<option>3</option>
					<option>2</option>
					<option>1</option>
				</select>
			</p>
			<p>
				Would you recommend this product?
				<input type="radio" name="recommend" value="yes" v-model="recommend">Yes
				<input type="radio" name="recommend" value="no" v-model="recommend">No
			</p>
			<p>
				<input type="submit" value="submit" >
			</p>
			</form>
		</div>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			recommend: null,
			errors: []
		};
	},
	methods: {
		onSubmit() {
			this.errors = [];
			if (this.name && this.review && this.rating && this.recommend) {
				let productReview = {
					name: this.name,
					review: this.review,
					rating: this.rating,
					recommend: this.recommend
				};

				this.$emit("review-Submitted", productReview);
				this.name = null;
				this.review = null;
				this.rating = null;
				this.recommend = null;
			} else {
				if (!this.name) this.errors.push("Name is required.");
				if (!this.review) this.errors.push("Review is required.");
				if (!this.rating) this.errors.push("Rating is required.");
				if (!this.recommend)
					this.errors.push("Please answer recommendation question.");
			}
		}
	}
});

const vue = new Vue({
	el: "#app",
	data: {
		premium: false,
		cart: []
	},
	methods: {
		updateCart: function(id) {
			this.cart.push(id);
		},
		removeItem: function(id) {
			for (var i = this.cart.length - 1; i >= 0; i--) {
				if (this.cart[i] === id) {
					this.cart.splice(i, 1);
				}
			}
		}
	}
});
