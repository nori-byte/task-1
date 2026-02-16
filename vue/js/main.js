
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true

        },
        methods: {
            addToCart() {
                this.$emit('add-to-cart');
            }
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
    <button v-on:click="deleteToCart">Delete to cart</button>
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
</div>
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
                    // variantSale: 'sale',
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                    // variantSale: 'Not sale',


                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        }
    },
    methods: {
        // addToCart() {
        //     this.$emit('add-to-cart',
        //     this.variants[this.selectedVariant].variantId);
        // },
        deleteToCart() {
            this.cart -= 1
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
                return this.brand + ' ' + this.product + ' ' + this.onSale;
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
        details: true,
        cart: 0,
    },
    methods: {
        updateCart() {
            this.cart += 1;
        }
    }
})





