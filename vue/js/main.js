let eventBus = new Vue()

Vue.component('cart', {
    props: {
        cartItems: {
            type: Array,
            required: true
        },
        premium: {
            type:Boolean,
            required: true
        },
        products: {
            type: Array,
            required: true
        }
    },
    template: `
     <div class="cart">
     <h2>Корзинка</h2>
     <div v-for="(id,index) in cartItems :key=index class="cart-item">
<!--     <img :src="variant.variantImage" class="cart-image">-->
        <p>{{variantImage}}</p>
        <p>{{variantQuantity}}</p>
        <p>{{price}}</p>
        <p>{{shipping}}</p>
     </div>
     <p>Details: {{ details }}</p>
</div>
`,
    data() {
        return {
            price:25
        }
    },
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        },
        shipping: {
            type:String, Number,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           <p>{{ review.value }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
             <product-review></product-review>
       </div>
     
     <div v-show="selectedTab === 'Shipping'">
     <p v-if="shipping === 'Free'"> You have premium snipping!</p>
     <p v-else>Standart shipping rate</p>
     </div>
     
     <div v-show="selectedTab === 'Details'">
     <p>Details: {{ details }}</p>
     </div>
     </div>
`,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    },
});
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
                eventBus.$emit('review-submitted', productReview);
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
<product-tabs 
:reviews="reviews"
:shipping="shipping"
:details="details">
</product-tabs>

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
                    variantQuantity: 1,

                }
            ],
            reviews: [],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        });
        eventBus.$on('return-to-stock', (id) => {
            let variant = this.variants.find((variant) => variant.variantId === id)
            if (variant) {
                variant.variantQuantity += 1;
            }
        });
    },

    methods: {

        addToCart() {
            if (this.variants[this.selectedVariant].variantQuantity > 0) {
                this.variants[this.selectedVariant].variantQuantity -= 1;
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            }
        },
        removeToCart() {
            const currentVariant = this.variants[this.selectedVariant];
            currentVariant.variantQuantity +=1;
                this.$emit('remove-to-cart', currentVariant.variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
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





