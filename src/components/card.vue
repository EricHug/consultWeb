<template>
  <div class="card">
    <h1>销售代表/导购/店员</h1>
    <p>揭阳普宁洪阳镇街道</p>
    <div class="qy_title">
      <img src="" alt="">
      <span>普宁XXX家具广场</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style lang="scss" scoped>
.card {
  padding: 24px !important;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
  p {
    color: #a3a3a3;
    font-size: 24px;
    padding: 20px 0;
  }
  .qy_title {
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #000;
      margin-right:16px;
    }
  }
}
</style>
