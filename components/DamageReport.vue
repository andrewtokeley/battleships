<template>
  <div class="damage-report">
    <div class="wrapper">
      <div class="damage-title">
        DAMAGE
      </div>
      <div v-if="damage.length > 0" class="container">
        <template v-for="(item, index) in damage">
          <div
            :key="item.name"
            class="label"
            :style="`{ color: ${item.type.colour}}`"
          >
            {{ item.name.toUpperCase().slice(0, 2) }}
          </div>
          <div
            :key="index"
            :class="`block${item.length}`"
          >
            <div class="progress" :style="{ width: item.hits/item.length*100 + '%', backgroundColor: item.type.colour }">
          &nbsp;
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    damage: {
      type: Array,
      default: () => { return [] }
    }
  },
  setup (props) {
    // console.log(props.damage)
    // const damage = props.board.damageReport
    // return {
    //   damage
    // }
  }
}
</script>

<style scoped>
.damage-report {
  display:flex;
  flex-direction: column;
  align-items: center;
}
.wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--bs-lightblue);
}

.damage-title {
  position: absolute;
  top: -0.5rem;;
  display: inline-block;
  margin-bottom: -10px;
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
  width: auto;
  font-size: var(--bs-font-size-normal);
  color: var(--bs-lightblue);
  background: var(--bs-blue);

}

.container {
  display: grid;
  /* width: 200px; */
  /* height: 100px; */
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  column-gap: 4px;
  row-gap: 4px;
  padding: 20px 10px 10px 10px;
  color: var(--bs-lightblue);
  font-size: var(--bs-font-size-normal);
}
.label {
  grid-column: 1 / span 1;
}

.progress {
  /* background-color: #e06666ff; */
  color: #f4cccc;
}
.block5 {
  grid-column: 2 / span 5;
  background-color: var(--bs-ship-5)
}
.block4 {
  grid-column: 2 / span 4;
  background-color: var(--bs-ship-4)
}
.block3 {
  grid-column: 2 / span 3;
  background-color: var(--bs-ship-3)
}

.block2 {
  grid-column: 2 / span 2;
  background-color: var(--bs-ship-2)
}
</style>
