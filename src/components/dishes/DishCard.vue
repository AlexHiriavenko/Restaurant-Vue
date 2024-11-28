<template>
  <v-card class="dish-card mx-auto mb-4" elevation="2">
    <div v-if="dish.discount_percent" class="discount-label">
      <div>Знижка</div>
      <div>{{ dish.discount_percent }}%</div>
    </div>

    <v-img
      :src="dish.img"
      :alt="dish.name"
      class="dish-image"
      cover
      @click="navigateToDishPage"
    />

    <v-card-text class="dish-details">
      <h3 class="dish-name" @click="navigateToDishPage">{{ dish.name }}</h3>

      <p class="dish-description">{{ dish.description }}</p>

      <p class="dish-price">{{ dish.final_price }} грн</p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        @click="navigateToDishPage"
        class="details-button"
        color="yellow darken-3"
        block
      >
        Замовити
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  dish: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      name: '',
      slug: '',
      description: '',
      final_price: 0,
      img: '',
      category: '',
      discount_percent: null
    })
  }
});
const route = useRoute();
const router = useRouter();
const slug = computed(() => route.params.categorySlug);

const navigateToDishPage = () => {
  router.push({
    name: 'dish',
    params: {
      categorySlug: props.dish?.category_slug || slug.value,
      dishSlug: props.dish.slug
    }
  });
};
</script>
