Vue.component('product-review', {
    template: `

<form class="review-form" @submit.prevent="onSubmit">

<p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>

 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>
 <fieldset>
 <div class="list">Would you recommend this product?<br>
 <div>
<input type="radio" name="recommend" id="value1" class="button" v-model="value" value="yes">
<label for="value1">yes</label></div>
 <div>
<input type="radio" name="recommend" id="value2" class="button" v-model="value" value="no">
<label for="value2">no</label></div>
</div>
</fieldset>
 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>

</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            value:null,
        }
    },
    methods:{
        onSubmit() {
            this.errors = [];
            if(this.name && this.review && this.rating && this.value) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    value: this.value,
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.value = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.value) this.errors.push("Value required.")
            }
        }
    }
})


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true

        }
    },
    template: `
 <div class="product">
 
        <div class="product-image">
            <img :src="image" :alt="altText" />
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>Shipping: {{ shipping }}</p>
            <p>details: {{ details }}</p>
            <a :href="link"> More products like this</a>
            <p v-if="inStock">In stock</p>
            <p v-else :class="{ outOfStock: !inStock || inventory <= 0 }">Out of Stock</p>
            <p>{{ sale }}</p>
    <p>{{description}}</p>
    <ul>
    <li v-for="size in sizes">{{size}}</li>
    </ul>
    <button v-on:click="removeToCart">Remove to cart</button>
    <div v-for="variant in variants" :key="variant.variantId">
    </div>

    <div
        class="color-box"
        v-for="(variant, index) in variants"
        :key="variant.variantId"
        :style="{backgroundColor:variant.variantColor }"
        @mouseover="updateProduct(index)"

    >
    </div>
    <button
        v-on:click="addToCart"
        :disabled="!inStock"
        :class="{disabledButton: !inStock }"
    >
        Add to cart</button>
        </div>
<div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
              <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
              <p>{{ review.value }}</p>
              </li>
            </ul>
           </div> <product-review @review-submitted="addReview"></product-review>
       </div>

`,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 100,
            onSale: false,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,

                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,

                }
            ],
            reviews: [],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        removeToCart() {
            this.$emit('remove-to-cart');
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }

    },

    computed: {
            title() {
                return this.brand + ' ' + this.product;
            },
            image() {
                return this.variants[this.selectedVariant].variantImage
            },
            inStock(){
                return this.variants[this.selectedVariant].variantQuantity
            },
            // sale() {
            //     return this.brand + ' ' + this.product + ' ' + this.onSale;
            // },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' сейчас участвует в распродаже!';
            } else {
                return this.brand + ' ' + this.product + ' сейчас не участвует в распродаже';
            }
        },
            shipping() {
                if (this.premium) {
                    return "Free";
                } else {
                    return 2.99
                }
            }

        }

})
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
});
let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        details:true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeToCart() {
            this.cart.pop();
        }
    }
})





