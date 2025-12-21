<script setup lang="ts">
import { NewsTicker } from '@/data/news-ticker';
import { onMounted, useTemplateRef } from 'vue';

const tickerRef = useTemplateRef("ticker"), lineRef = useTemplateRef("line");

function setup() {
  const line_el = lineRef.value

  if (line_el === null) return;

  const line = NewsTicker.calculateRandomNews();

  line_el.innerHTML = line.text;

  line_el.style.transitionDuration = "0ms";
  line_el.style.transform = "translateX(0)";

  const DELAY = 1000;
  setTimeout(() => scroll(line.id), DELAY);
}

function scroll(id: string) {
  const line_el = lineRef.value, ticker_el = tickerRef.value

  if (line_el === null || ticker_el === null) return;

  const SCROLL_SPEED = 1 * 100;
  const scrollDuration = (ticker_el.clientWidth + line_el.clientWidth) / SCROLL_SPEED;

  line_el.style.transitionDuration = scrollDuration+"s";
  line_el.style.transform = "translateX(-100%)";

  NewsTicker.addPlayer(id)

  setTimeout(setup, scrollDuration * 1e3);
}

onMounted(()=>{
  setup()
})
</script>

<template>
  <div class="g--news-ticker" ref="ticker">
    <div class="g--news-ticker__line g--news-line" ref="line">
      Hello, World!
    </div>
  </div>
</template>
